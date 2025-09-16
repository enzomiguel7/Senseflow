import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Server as SocketIOServer } from "socket.io";
import { startMqttAndSubscribe } from "./mqttHandler";
import { InfluxDB } from "@influxdata/influxdb-client";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});

// Inicia o MQTT listener
startMqttAndSubscribe(io);

// Config Influx
const influxUrl = process.env.INFLUX_URL || "http://localhost:8086";
const token = process.env.INFLUX_TOKEN || "my-token";
const org = process.env.INFLUX_ORG || "myorg";
const bucket = process.env.INFLUX_BUCKET || "sensor_bucket";

const influxDB = new InfluxDB({ url: influxUrl, token });

// ✅ Endpoint de histórico de eventos
app.get("/api/events", async (req: Request, res: Response) => {
  try {
    const sensorId = req.query.sensorId as string | undefined;
    const limit = parseInt((req.query.limit as string) || "100", 10);

    const queryApi = influxDB.getQueryApi(org);

    const sensorFilter = sensorId
      ? `|> filter(fn: (r) => r["sensorId"] == "${sensorId}")`
      : "";

    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "sensor_events")
        ${sensorFilter}
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n:${limit})
    `;

    const rows: any[] = [];
    await new Promise<void>((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const o = tableMeta.toObject(row);
          rows.push(o);
        },
        error: (error) => {
          console.error("❌ query error", error);
          reject(error);
        },
        complete: () => {
          resolve();
        }
      });
    });

    res.json(rows);
  } catch (err) {
    console.error("❌ /api/events error", err);
    res.status(500).send("Internal server error");
  }
});

// Sobe servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
