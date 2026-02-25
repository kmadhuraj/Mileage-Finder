import React from 'react';
import { Trash2, Download, Trash } from 'lucide-react';
import type { Trip } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    trips: Trip[];
    onDelete: (id: string) => void;
    onClear: () => void;
}

export const TripHistory: React.FC<Props> = ({ trips, onDelete, onClear }) => {
    const exportCSV = () => {
        const headers = ['Date', 'Distance (km)', 'Fuel (L)', 'Capacity (L)', 'Mileage (km/L)', 'Price', 'Cost/km'];
        const rows = trips.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.distance,
            t.fuel,
            t.totalFuelCapacity || '-',
            t.mileage.toFixed(2),
            t.price || '-',
            t.costPerKm?.toFixed(2) || '-'
        ]);

        const content = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'mileage_history.csv');
        link.click();
    };

    if (trips.length === 0) {
        return (
            <div className="glass-card p-12 text-center opacity-50">
                <p className="text-lg">No history yet. Add your first trip!</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Trip History</h3>
                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Export CSV"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={onClear}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Clear All"
                    >
                        <Trash className="w-4 h-4" /> Clear
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Distance</th>
                            <th className="px-6 py-4 font-medium">Fuel</th>
                            <th className="px-6 py-4 font-medium">Mileage</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <AnimatePresence mode="popLayout">
                            {trips.map((trip) => (
                                <motion.tr
                                    key={trip.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        {format(new Date(trip.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">{trip.distance} km</td>
                                    <td className="px-6 py-4 text-sm">
                                        {trip.fuel} L
                                        {trip.totalFuelCapacity && (
                                            <span className="text-xs opacity-50 block">/ {trip.totalFuelCapacity}L tank</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${trip.mileage > 15 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                            trip.mileage > 10 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                'bg-red-500/10 text-red-600 dark:text-red-400'
                                            }`}>
                                            {trip.mileage.toFixed(2)} km/L
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onDelete(trip.id)}
                                            className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
