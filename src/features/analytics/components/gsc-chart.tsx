"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DailyRow = { date: string; clicks: number; impressions: number };

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

export default function GscChart({ data }: { data: DailyRow[] }) {
  const chartData = data.map((d) => ({ ...d, date: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border) / 0.4)",
            borderRadius: "0.75rem",
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))", marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8, color: "hsl(var(--muted-foreground))" }}
        />
        <Line type="monotone" dataKey="clicks" stroke="#4285F4" strokeWidth={2} dot={false} name="Clicks" />
        <Line type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Impressions" strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
