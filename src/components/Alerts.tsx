import React from 'react';
import { Star, TrendingDown } from 'lucide-react';
import type { Trip } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    trips: Trip[];
}

export const Alerts: React.FC<Props> = ({ trips }) => {
    if (trips.length < 2) return null;

    const latest = trips[0];
    const previous = trips[1];
    const mileageDrop = previous.mileage - latest.mileage;
    const isSignificantDrop = mileageDrop > (previous.mileage * 0.15); // > 15% drop
    const isBestPerformance = latest.id === [...trips].sort((a, b) => b.mileage - a.mileage)[0].id;

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {isSignificantDrop && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4"
                    >
                        <div className="p-2 bg-red-500 rounded-xl">
                            <TrendingDown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-600 dark:text-red-400">Significant Drop Detected</h4>
                            <p className="text-sm opacity-80">Your mileage dropped by {mileageDrop.toFixed(1)} km/L compared to last time. Check your tire pressure or fuel quality.</p>
                        </div>
                    </motion.div>
                )}

                {isBestPerformance && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4"
                    >
                        <div className="p-2 bg-emerald-500 rounded-xl">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">New Personal Best!</h4>
                            <p className="text-sm opacity-80">This is your best fuel efficiency ever recorded. Keep driving efficiently!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
