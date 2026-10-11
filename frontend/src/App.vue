
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const drones = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/drones')
    drones.value = response.data
  } catch {
    error.value = 'Unable to load UAV data'
  }
})
</script>

<template>
  <main class="dashboard">
    <h1>UAV Mission Coordination System</h1>
    <p>Fleet Monitoring Dashboard</p>

    <p v-if="error">{{ error }}</p>

    <section class="fleet">
      <article v-for="drone in drones" :key="drone.id" class="card">
        <h2>{{ drone.name }}</h2>
        <p>Battery: {{ drone.battery }}%</p>
        <p>Status: {{ drone.status }}</p>
        <p>Altitude: {{ drone.altitude }} m</p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 40px;
  background: #0f172a;
  color: white;
  font-family: Arial, sans-serif;
}

.fleet {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.card {
  background: #1e293b;
  padding: 24px;
  border-radius: 12px;
  min-width: 220px;
}
</style>
