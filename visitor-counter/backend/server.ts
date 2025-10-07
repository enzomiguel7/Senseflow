import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import mqtt from "mqtt";
import { Server as SocketIOServer } from "socket.io";
import mariadb from "mariadb";

/* ============ MariaDB ============ */
const pool = mariadb.createPool({
  host: process.env.DB_HOST || "mariadb",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "0",
  database: process.env.DB_NAME || "RegistrosSensor",
  connectionLimit: 5
});

/* ============ Express + Socket.IO ============ */
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

/* ============ MQTT ============ */
const mqttUrl = process.env.MQTT_BROKER_URL || "mqtt://mosquitto:1883";
const client = mqtt.connect(mqttUrl);

client.on("connect", () => {
  console.log("✅ MQTT conectado em:", mqttUrl);
  client.subscribe("sensors/+/barreira", (err) => {
    if (err) console.error("❌ Erro ao inscrever no tópico:", err);
    else console.log("📡 Subscrito em sensors/+/barreira");
  });
});

client.on("message", async (topic, payload) => {
  try {
    // converte para string e remove espaços extras
    const msgStr = payload.toString('utf-8').trim();

    // tenta parsear JSON
    const msg = JSON.parse(msgStr);

    const timestamp = msg.timestamp
      ? new Date(msg.timestamp).toISOString().slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");

    const event = {
      sensor_id: msg.sensorId || topic.split("/")[1],
      type: msg.type || "unknown",
      detected: !!msg.detected,
      value: msg.value || null,
      timestamp
    };

    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO sensor_events(sensor_id, type, detected, value, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [event.sensor_id, event.type, event.detected, event.value, event.timestamp]
    );
    conn.release();

    console.log("💾 Evento salvo no DB:", event);

    io.emit("sensor_event", event);

  } catch (err) {
    console.error("❌ Erro processando MQTT:", err);
  }
});

/* ============ REST API ============ */
app.get("/api/events", async (req, res) => {
  const sensorId = req.query.sensorId as string | undefined;
  const limit = parseInt((req.query.limit as string) || "100", 10);

  try {
    const conn = await pool.getConnection();
    const query = sensorId
      ? "SELECT * FROM sensor_events WHERE sensor_id = ? ORDER BY timestamp DESC LIMIT ?"
      : "SELECT * FROM sensor_events ORDER BY timestamp DESC LIMIT ?";
    const params = sensorId ? [sensorId, limit] : [limit];

    const rows = await conn.query(query, params);
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar eventos:", err);
    res.status(500).send("Erro ao buscar eventos");
  }
});

/* ============ START SERVER ============ */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Server rodando na porta", PORT));
