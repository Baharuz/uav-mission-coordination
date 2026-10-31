# UAV Mission Coordination

## PostgreSQL setup

Create a PostgreSQL database named `uav_mission`, then apply the initial schema:

```powershell
psql -U postgres -c "CREATE DATABASE uav_mission;"
psql -U postgres -d uav_mission -f database/001_init.sql
```

Copy `services/telemetry-service/.env.example` to `.env` in the same directory and set `PGPASSWORD` to your local PostgreSQL password. Do not commit `.env`.

Start the services in separate terminals:

```powershell
cd services/telemetry-service
npm install
npm start
```

```powershell
cd services/api-gateway
npm install
npm start
```

Check `http://localhost:3000/api/drones`. The API Gateway calls Telemetry Service over gRPC, and Telemetry Service reads the `drones` table in PostgreSQL. The Vue frontend can be started from `frontend` with `npm install` and `npm run dev`.

