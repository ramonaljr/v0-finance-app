"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> })
const RechartsPieChart = dynamic(() => import("recharts").then(m => m.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then(m => m.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then(m => m.Cell), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false })

type PieDatum = {
  name: string
  value: number
  fill: string
  percentage: number
}

export function TransactionSpendingPieChart({ data }: { data: PieDatum[] }) {
  return (
    <div className="mb-6 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" strokeWidth={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-lg">
                    <p className="text-sm font-semibold text-foreground">{payload[0].name as string}</p>
                    <p className="text-sm text-muted-foreground">
                      ${Number(payload[0].value).toFixed(2)} ({(payload[0] as any).payload.percentage}%)
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}


