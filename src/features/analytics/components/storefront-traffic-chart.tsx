"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyStorefrontTraffic } from "@/features/analytics/server";

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

export default function StorefrontTrafficChart({ data }: { data: DailyStorefrontTraffic[] }) {
  // The tracker has no historical data before its first recorded visit. Hide
  // those pre-tracking dates instead of drawing a misleading line of zeros.
  const firstRecordedIndex = data.findIndex((row) => row.visitors > 0);
  const visibleData = firstRecordedIndex === -1 ? data : data.slice(firstRecordedIndex);
  const chartData = visibleData.map((row) => ({ ...row, label: formatDate(row.date) }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", opacity: 0.6 }}
          tickLine={false}
          axisLine={false}
          allowDataOverflow={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border) / 0.4)",
            borderRadius: "0.75rem",
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))", marginBottom: 4 }}
          formatter={(value: number) => [`${value.toLocaleString("id-ID")} pengunjung`, "Storefront"]}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
          name="Pengunjung storefront"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
