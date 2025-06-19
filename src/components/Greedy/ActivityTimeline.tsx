export interface Activity {
  id: number;
  start: number;
  end: number;
}

interface ActivityTimelineProps {
  activities: Activity[];
  selected: Set<number>;
  current: number | null;
}

export default function ActivityTimeline({ activities, selected, current }: ActivityTimelineProps) {
  const width = 400;
  const height = 80;
  const minTime = Math.min(...activities.map(a => a.start));
  const maxTime = Math.max(...activities.map(a => a.end));
  const timeSpan = maxTime - minTime;
  return (
    <svg width={width} height={height} className="bg-gray-800 rounded-lg" style={{ maxWidth: "100%" }}>
      {activities.map(a => {
        const x1 = ((a.start - minTime) / timeSpan) * (width - 40) + 20;
        const x2 = ((a.end - minTime) / timeSpan) * (width - 40) + 20;
        let color = "#a78bfa";
        if (selected.has(a.id)) color = "#22d3ee";
        else if (current === a.id) color = "#facc15";
        return (
          <g key={a.id}>
            <rect x={x1} y={20} width={x2 - x1} height={28} rx={8} fill={color} opacity={selected.has(a.id) ? 1 : 0.7} />
            <text x={(x1 + x2) / 2} y={36} textAnchor="middle" fontSize={15} fill="#222" fontWeight="bold">
              {`A${a.id}`}
            </text>
            <text x={x1} y={60} fontSize={12} fill="#fff" textAnchor="middle">{a.start}</text>
            <text x={x2} y={60} fontSize={12} fill="#fff" textAnchor="middle">{a.end}</text>
          </g>
        );
      })}
    </svg>
  );
}
