import { Debt } from "@/lib/types";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "./debt/chart/chartUtils";
import { getGradientDefinitions, chartConfig } from "./debt/chart/chartStyles";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";
import { calculateUnifiedPayoff } from "@/lib/utils/payment/unifiedCalculator";
import { format } from "date-fns";
import { ChartTooltip } from "./debt/chart/ChartTooltip";
import { ChartGradients } from "./debt/chart/ChartGradients";
import { DebtAreaCharts } from "./debt/chart/DebtAreaCharts";
import { useMemo } from "react";

interface DebtChartProps {
  debts: Debt[];
  monthlyPayment: number;
  currencySymbol?: string;
  oneTimeFundings?: OneTimeFunding[];
  totalMinPayments: number;
}

export const DebtChart = ({ 
  debts, 
  monthlyPayment, 
  currencySymbol = '$',
  oneTimeFundings = [],
  totalMinPayments
}: DebtChartProps) => {
  console.log('DebtChart render:', {
    numberOfDebts: debts.length,
    monthlyPayment,
    oneTimeFundings: oneTimeFundings.length
  });

  const { chartData, gradients } = useMemo(() => {
    const payoffResults = calculateUnifiedPayoff(debts, monthlyPayment, oneTimeFundings);
    const gradients = getGradientDefinitions(debts);

    // Generate chart data from unified calculation
    const data = [];
    const maxMonths = Math.max(...Object.values(payoffResults).map(r => r.months));

    for (let month = 0; month <= maxMonths; month++) {
      const point: any = {
        month,
        monthLabel: format(addMonths(new Date(), month), 'MMM yyyy'),
        total: 0
      };

      // Add balances for each debt
      debts.forEach(debt => {
        const debtResults = payoffResults[debt.id];
        if (debtResults && month < debtResults.monthlyPayments.length) {
          point[debt.name] = debtResults.monthlyPayments[month].remainingBalance;
          point.total += debtResults.monthlyPayments[month].remainingBalance;
        } else {
          point[debt.name] = 0;
        }
      });

      // Add one-time funding marker if applicable
      const fundingForMonth = oneTimeFundings.find(funding => {
        const fundingDate = new Date(funding.payment_date);
        const pointDate = addMonths(new Date(), month);
        return fundingDate.getMonth() === pointDate.getMonth() &&
               fundingDate.getFullYear() === pointDate.getFullYear();
      });

      if (fundingForMonth) {
        point.oneTimeFunding = fundingForMonth.amount;
      }

      data.push(point);
    }

    return { chartData: data, gradients };
  }, [debts, monthlyPayment, oneTimeFundings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={chartConfig.margin}
        >
          <ChartGradients gradients={gradients} />
          
          <CartesianGrid 
            strokeDasharray={chartConfig.gridStyle.strokeDasharray}
            stroke={chartConfig.gridStyle.stroke}
            vertical={false}
          />

          <XAxis
            dataKey="monthLabel"
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            label={{
              value: "Balance",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: chartConfig.axisStyle
            }}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
          />
          
          <Tooltip 
            content={
              <ChartTooltip 
                currencySymbol={currencySymbol}
                extraPayment={monthlyPayment}
                totalMinPayments={totalMinPayments}
              />
            } 
          />
          
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={chartConfig.legendStyle}
          />

          {/* Reference lines for one-time funding */}
          {oneTimeFundings.map((funding, index) => (
            <ReferenceLine
              key={index}
              x={format(new Date(funding.payment_date), 'MMM yyyy')}
              stroke="#10B981"
              strokeDasharray="3 3"
              label={{
                value: `+${currencySymbol}${funding.amount}`,
                position: 'top',
                fill: '#10B981',
                fontSize: 12
              }}
            />
          ))}

          <DebtAreaCharts debts={debts} />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};