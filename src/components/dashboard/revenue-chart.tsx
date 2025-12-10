'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { PaymentMode } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface RevenueChartProps {
    data: { mode: PaymentMode; amount: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const chartConfig = {
        amount: {
            label: 'Amount',
            color: 'hsl(var(--primary))',
        },
    };

    return (
        <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis
                        dataKey="mode"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                    />
                    <ChartTooltip
                        cursor={{fill: 'hsl(var(--accent))', radius: 'var(--radius)'}}
                        content={<ChartTooltipContent
                            formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value))}
                            indicator='dot'
                        />}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
