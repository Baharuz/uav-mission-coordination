
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

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

const drones = [
  { id: 1, name: 'UAV-01', battery: 85, status: 'active', altitude: 120 },
  { id: 2, name: 'UAV-02', battery: 62, status: 'idle', altitude: 0 },
  { id: 3, name: 'UAV-03', battery: 94, status: 'idle', altitude: 0 }
];

function getDrones(call, callback) {
  callback(null, { drones });
}

const server = new grpc.Server();

server.addService(telemetryProto.TelemetryService.service, {
  GetDrones: getDrones
});

server.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Telemetry gRPC Service running on port ${port}`);
  }
);
