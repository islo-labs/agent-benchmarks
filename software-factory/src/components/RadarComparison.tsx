import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { DimensionScore } from '../types'

interface RadarComparisonProps {
  scores: DimensionScore[]
}

export function RadarComparison({ scores }: RadarComparisonProps) {
  const data = scores.map((s) => ({
    dimension: s.label,
    you: s.score,
    benchmark: s.benchmark,
    top: s.topPerformers,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(20,20,24,0.10)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#555560', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#b8b8c2', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Top 10%"
            dataKey="top"
            stroke="#b8b8c2"
            fill="#b8b8c2"
            fillOpacity={0.04}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <Radar
            name="Industry avg"
            dataKey="benchmark"
            stroke="#8a8a95"
            fill="#8a8a95"
            fillOpacity={0.08}
            strokeWidth={1}
          />
          <Radar
            name="You"
            dataKey="you"
            stroke="#7a3de6"
            fill="#7a3de6"
            fillOpacity={0.18}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex justify-center gap-6 text-xs text-ink-4">
        <span className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm bg-islo" /> You
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-ink-4" /> Industry avg
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 border-t border-dashed border-ink-5" /> Top 10%
        </span>
      </div>
    </div>
  )
}
