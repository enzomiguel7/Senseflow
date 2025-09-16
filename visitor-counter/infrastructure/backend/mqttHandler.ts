import mqtt, { MqttClient } from "mqtt";
import { writeSensorEvent } from "./influxClient";
import { Server as SocketIOServer } from "socket.io";
import { ISubscriptionGrant } from "mqtt";


export function startMqttAndSubscribe(io: SocketIOServer): void {
  const brokerUrl = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
  const client: MqttClient = mqtt.connect(brokerUrl);
  
client.subscribe(
  "sensors/+/barreira",
  (err: Error | null, granted?: ISubscriptionGrant[]) => {
    if (err) {
      console.error("❌ subscribe error", err);
    } else {
      const topics = granted?.map(g => g.topic).join(", ") || "none";
      console.log("✅ Subscribed to topic:", topics);
    }
  }
);


  client.on("message", (topic: string, payload: Buffer) => {
    try {
      const text = payload.toString();
      const data = JSON.parse(text);

      const sensorId = data.sensorId || extractSensorIdFromTopic(topic);
      const timestamp = data.timestamp || new Date().toISOString();

      const event = {
        sensorId,
        type: data.type,
        detected: data.detected,
        value: data.value,
        timestamp
      };

      // grava no InfluxDB
      writeSensorEvent(event);

      // emite para clientes conectados em tempo real
      io.emit("sensor_event", event);
    } catch (err) {
      console.error("❌ mqtt message parse error", err);
    }
  });

  function extractSensorIdFromTopic(topic: string): string {
    const parts = topic.split("/");
    return parts.length >= 2 ? parts[1] : "unknown";
  }
}
