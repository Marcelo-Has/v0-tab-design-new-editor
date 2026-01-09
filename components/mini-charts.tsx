"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

const barData = [
  { name: "Furniture", value: 750 },
  { name: "Office", value: 720 },
  { name: "Tech", value: 880 },
]

const lineData = [
  { date: "Jan", value: 400 },
  { date: "Feb", value: 600 },
  { date: "Mar", value: 550 },
  { date: "Apr", value: 780 },
  { date: "May", value: 850 },
]

const pieData = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 200 },
  { name: "D", value: 100 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"]

export function MiniBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MiniLineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={lineData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MiniAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={lineData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#areaGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MiniPieChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" stroke="none">
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
