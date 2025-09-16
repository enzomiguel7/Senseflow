import { InfluxDB, Point } from "@influxdata/influxdb-client";

// Ler variáveis de ambiente
const url = process.env.INFLUX_URL || "http://localhost:8086";
const token = process.env.INFLUX_TOKEN || "Ha6ThhnyNv-_H5Sju5NodKt9GiA1VxFXT1mi0Pgrb6s0j0FYbx9OcGAnptwRtzfTLdOdlXsHH05sex0qdRCYOw==";
const org = process.env.INFLUX_ORG || "myorg";
const bucket = process.env.INFLUX_BUCKET || "sensor_bucket";

// Criar cliente do InfluxDB
const client = new InfluxDB({ url, token });

// Criar API de escrita
const writeApi = client.getWriteApi(org, bucket, "ns"); // precisão nanosegundos

// Função para gravar evento do sensor
export function writeSensorEvent(event: {
  sensorId: string;
  type?: string;
  detected: boolean;
  value?: number;
  timestamp?: string;
}) {
  const point = new Point("sensor_events")
    .tag("sensorId", event.sensorId)
    .tag("type", event.type || "unknown")
    .booleanField("detected", event.detected);

  if (event.value !== undefined) {
    point.floatField("value", event.value);
  }

  if (event.timestamp) {
    point.timestamp(new Date(event.timestamp));
  }

  writeApi.writePoint(point);
  console.log("Evento gravado no Influx:", event);
}

// Opcional: exportar client para consultas
export { client };
