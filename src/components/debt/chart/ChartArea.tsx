import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { ChartData } from "./types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { format } from "date-fns";
import { formatCurrency } from "./chartUtils";

interface ChartAreaProps {
  data: ChartData[];
  maxDebt: number;
  currencySymbol: string;
  onHover: (data: { x: number; y: number; date: string; values: { name: string; value: number }[] } | null) => void;
  oneTimeFundings: OneTimeFunding[];
}

const COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#ea580c", // orange
];

export const ChartArea = ({
  data,
  maxDebt,
  currencySymbol,
  onHover,
  oneTimeFundings
}: ChartAreaProps) => {
  const debtNames = Object.keys(data[0]).filter(key => 
    key !== 'date' && 
    key !== 'monthLabel' && 
    key !== 'month' && 
    key !== 'oneTimeFunding'
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        onMouseMove={(e) => {
          if (e.activePayload) {
            onHover({
              x: e.activeCoordinate?.x || 0,
              y: e.activeCoordinate?.y || 0,
              date: e.activePayload[0].payload.date,
              values: e.activePayload.map(entry => ({
                name: entry.name,
                value: entry.value
              }))
            });
          }
        }}
        onMouseLeave={() => onHover(null)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickFormatter={(value) => formatCurrency(value, currencySymbol)}
          domain={[0, maxDebt]}
        />
        <Tooltip
          content={() => null}
        />
        <Legend />
        {debtNames.map((name, index) => (
          <Area
            key={name}
            type="monotone"
            dataKey={name}
            stackId="1"
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.3}
            name={name}
          />
        ))}
        {oneTimeFundings.map((funding, index) => (
          <ReferenceLine
            key={index}
            x={funding.payment_date}
            stroke="#10B981"
            strokeDasharray="3 3"
            label={{
              value: `${currencySymbol}${funding.amount}`,
              position: 'top',
              fill: '#10B981',
              fontSize: 12
            }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};