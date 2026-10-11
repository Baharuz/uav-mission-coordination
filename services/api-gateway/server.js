
const express = require("express");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Telemetry Service gRPC contract
const PROTO_PATH = path.join(
  __dirname,
  "../telemetry-service/telemetry.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const telemetryProto =
  grpc.loadPackageDefinition(packageDefinition).telemetry;

// gRPC client
const telemetryClient = new telemetryProto.TelemetryService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "UAV API Gateway"
  });
});

// Get UAV data through gRPC
app.get("/api/drones", (req, res) => {
  const deadline = new Date(Date.now() + 3000);

  telemetryClient.GetDrones({}, { deadline }, (error, response) => {
    if (error) {
      console.error("Telemetry gRPC error:", error.message);

      return res.status(503).json({
        error: "Telemetry service unavailable"
      });
    }

    res.json(response.drones);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
