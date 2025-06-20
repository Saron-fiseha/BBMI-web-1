"use client"

import type * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function BarChart({
  data,
  xKey,
  yKeys,
  className,
  ...props
}: {
  data: any[]
  xKey: string
  yKeys: string[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={`hsl(${index * 40}, 70%, 50%)`} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({
  data,
  xKey,
  yKeys,
  className,
  ...props
}: {
  data: any[]
  xKey: string
  yKeys: string[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Line key={key} type="monotone" dataKey={key} stroke={`hsl(${index * 40}, 70%, 50%)`} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChart({
  data,
  nameKey,
  dataKey,
  className,
  ...props
}: {
  data: any[]
  nameKey: string
  dataKey: string
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
