
require('dotenv').config();

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { pool } = require('./db');

const PROTO_PATH = path.join(__dirname, 'telemetry.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const telemetryProto =
  grpc.loadPackageDefinition(packageDefinition).telemetry;

async function getDrones(call, callback) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, battery, status, altitude FROM drones ORDER BY id'
    );
    callback(null, { drones: rows });
  } catch (error) {
    console.error('PostgreSQL query failed:', error);
    callback({ code: grpc.status.UNAVAILABLE, message: 'Drone data is unavailable' });
  }
}

async function start() {
  try {
    await pool.query('SELECT 1');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    process.exitCode = 1;
    await pool.end();
    return;
  }

  const server = new grpc.Server();
  server.addService(telemetryProto.TelemetryService.service, { GetDrones: getDrones });
  server.bindAsync(
    process.env.GRPC_HOST || '127.0.0.1:50051',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('Telemetry gRPC startup failed:', error);
        process.exitCode = 1;
        pool.end();
        return;
      }
      console.log(`Telemetry gRPC Service running on port ${port}`);
    }
  );
}

start();

