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
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "RegistrosSensor",
  connectionLimit: 10
});

/* ============ Express + Socket.IO ============ */
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

/* ============ MQTT ============ */
const mqttUrl = process.env.MQTT_BROKER_URL || "mqtt://test.mosquitto.org:1883";

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
    const msgStr = payload.toString("utf-8").trim();
    const msg = JSON.parse(msgStr);

    // Cria objetos de data/hora a partir do timestamp ou da hora atual
  const now = msg.timestamp ? new Date(msg.timestamp) : new Date();

// Subtrai 3 horas para converter UTC -> GMT-3
const brasilOffset = 3 * 60 * 60 * 1000; // 3 horas em ms
const brasilNow = new Date(now.getTime() - brasilOffset);

const date_ = brasilNow.toISOString().slice(0, 10);   // YYYY-MM-DD
const time_ = brasilNow.toTimeString().slice(0, 8);   // HH:MM:SS

const event = {
  sensor_id: msg.sensorId || topic.split("/")[1],
  type: msg.type || "unknown",
  detected: !!msg.detected,
  value: msg.value || null,
  date_,
  time_
};


    // Inserção no banco de dados
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO sensor_events(sensor_id, type, detected, value, date_, time_)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event.sensor_id, event.type, event.detected, event.value, event.date_, event.time_]
    );
    conn.release();

    console.log("💾 Evento salvo no DB:", event);

    // Envia para frontend via socket.io
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
      ? "SELECT * FROM sensor_events WHERE sensor_id = ? ORDER BY date_ DESC, time_ DESC LIMIT ?"
      : "SELECT * FROM sensor_events ORDER BY date_ DESC, time_ DESC LIMIT ?";
    const params = sensorId ? [sensorId, limit] : [limit];

    const rows: any[] = await conn.query(query, params);
    conn.release();

    // Formata date_ e time_ para padrão DD/MM/AA e HH:MM:SS
    const formatted = rows.map(r => {
      const dateObj = r.date_ ? new Date(r.date_) : null;
      const dateStr = dateObj
        ? dateObj.toLocaleDateString("pt-BR").slice(0, 10) // Ex: 23/10/25
        : null;

      const timeStr = r.time_ ? r.time_.toString().slice(0, 8) : null; // HH:MM:SS

      return {
        ...r,
        date_: dateStr,
        time_: timeStr
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Erro ao buscar eventos:", err);
    res.status(500).send("Erro ao buscar eventos");
  }
});


app.delete("/api/events", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM sensor_events;");
    conn.release();

    res.status(200).json({message: "Dados apagados com êxito"})

    // Opcional: notifica front-end via socket
    io.emit("reset_events")

    console.log("Todos os registros foram apagados do DB");
  } catch(err){
    console.error("Erro ao resetar eventos:", err);
    res.status(500).json({error: "Erro ao resetar eventos"});
  }
});

/* ============ START SERVER ============ */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Server rodando na porta", PORT));
