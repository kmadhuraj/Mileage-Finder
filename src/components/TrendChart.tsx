import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import type { Trip } from '../types';
import { format } from 'date-fns';

interface Props {
    trips: Trip[];
}

export const TrendChart: React.FC<Props> = ({ trips }) => {
    const data = [...trips].reverse().map(t => ({
        date: format(new Date(t.date), 'MMM dd'),
        mileage: Number(t.mileage.toFixed(2)),
    }));

    if (trips.length < 2) {
        return (
            <div className="glass-card p-12 text-center opacity-50 h-full flex items-center justify-center">
                <p>Add at least 2 entries to see the trend chart.</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 h-[400px]">
            <h3 className="font-bold text-lg mb-6">Mileage Trend</h3>
            <div className="w-full h-full pb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorMileage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, opacity: 0.5 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, opacity: 0.5 }}
                            unit=" km/L"
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                color: 'inherit'
                            }}
                            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="mileage"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMileage)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
