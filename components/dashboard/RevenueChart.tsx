"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dados = [
  { mes: "Jan", receita: 0 },
  { mes: "Fev", receita: 0 },
  { mes: "Mar", receita: 0 },
  { mes: "Abr", receita: 0 },
  { mes: "Mai", receita: 0 },
];

export function RevenueChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(25% 0.01 260)" />
          <XAxis dataKey="mes" tick={{ fill: "oklch(60% 0 0)", fontSize: 12 }} />
          <YAxis tick={{ fill: "oklch(60% 0 0)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(18% 0.01 260)",
              border: "1px solid oklch(25% 0.01 260)",
              borderRadius: "8px",
              color: "oklch(90% 0 0)",
            }}
          />
          <Line
            type="monotone"
            dataKey="receita"
            stroke="oklch(62% 0.26 250)"
            strokeWidth={2}
            dot={{ fill: "oklch(62% 0.26 250)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
