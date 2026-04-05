<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-lg font-semibold mb-2">Growth Analysis</h2>
    <ResponsiveContainer width="100%" height="250">
      <LineChart :data="data">
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#3b82f6" strokeWidth="2" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</template>

<script setup>
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 800 },
  { name: "Mar", uv: 1200 },
  { name: "Apr", uv: 900 },
  { name: "May", uv: 1500 },
  { name: "Jun", uv: 2000 },
];
</script>