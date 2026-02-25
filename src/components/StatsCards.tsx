import React from 'react';
import { TrendingUp, Gauge, Droplets, Wallet } from 'lucide-react';
import type { Stats } from '../types';
import { motion } from 'framer-motion';

interface Props {
    stats: Stats;
}

export const StatsCards: React.FC<Props> = ({ stats }) => {
    const cards = [
        {
            label: 'Avg. Mileage',
            value: `${stats.averageMileage.toFixed(2)} km/L`,
            icon: <Gauge className="w-6 h-6 text-blue-500" />,
            color: 'bg-blue-500/10',
        },
        {
            label: 'Best Performance',
            value: `${stats.bestMileage.toFixed(2)} km/L`,
            icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
            color: 'bg-emerald-500/10',
        },
        {
            label: 'Total Fuel',
            value: `${stats.totalFuel.toFixed(1)} L`,
            icon: <Droplets className="w-6 h-6 text-amber-500" />,
            color: 'bg-amber-500/10',
        },
        {
            label: 'Total Distance',
            value: `${stats.totalDistance.toLocaleString()} km`,
            icon: <Wallet className="w-6 h-6 text-purple-500" />,
            color: 'bg-purple-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                        <p className="text-2xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${card.color}`}>
                        {card.icon}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
