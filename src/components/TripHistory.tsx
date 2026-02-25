import React, { useState } from 'react';
import { Trash2, Download, Trash, Calendar, Table as TableIcon } from 'lucide-react';
import type { Trip } from '../types';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    trips: Trip[];
    onDelete: (id: string) => void;
    onClear: () => void;
}

export const TripHistory: React.FC<Props> = ({ trips, onDelete, onClear }) => {
    const [view, setView] = useState<'all' | 'weekly'>('all');

    const filteredTrips = view === 'weekly'
        ? trips.filter(t => isWithinInterval(new Date(t.date), {
            start: startOfWeek(new Date()),
            end: endOfWeek(new Date())
        }))
        : trips;

    const exportCSV = () => {
        const headers = ['Date', 'Start ODO', 'End ODO', 'Distance (km)', 'Fuel (L)', 'Mileage (km/L)', 'Price', 'Location', 'Weather'];
        const rows = trips.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.startOdometer || '-',
            t.endOdometer || '-',
            t.distance,
            t.fuel,
            t.mileage.toFixed(2),
            t.price || '-',
            t.location?.address || '-',
            t.weather ? `${t.weather.temp}C ${t.weather.condition}` : '-'
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
                <p className="text-lg">No history yet. Record your first trip!</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg">Detailed Trip Log</h3>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setView('all')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${view === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
                        >
                            <TableIcon className="w-3 h-3 inline mr-1" />
                            All
                        </button>
                        <button
                            onClick={() => setView('weekly')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${view === 'weekly' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
                        >
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Weekly
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={onClear}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Trash className="w-4 h-4" /> Clear
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase tracking-wider text-slate-500">
                            <th className="px-6 py-4 font-bold">Date / Weather</th>
                            <th className="px-6 py-4 font-bold">Odometer / Dist</th>
                            <th className="px-6 py-4 font-bold">Fuel Used</th>
                            <th className="px-6 py-4 font-bold">Performance</th>
                            <th className="px-6 py-4 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <AnimatePresence mode="popLayout">
                            {filteredTrips.map((trip) => (
                                <motion.tr
                                    key={trip.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold">{format(new Date(trip.date), 'MMM dd, yyyy')}</p>
                                        {trip.weather && (
                                            <p className="text-[10px] opacity-40 font-medium capitalize">{trip.weather.condition}, {trip.weather.temp}°C</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold">{trip.distance.toFixed(1)} km</p>
                                        {trip.startOdometer !== undefined && (
                                            <p className="text-[10px] opacity-40 font-medium">ODO: {trip.startOdometer} → {trip.endOdometer}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold">{trip.fuel} L</p>
                                        {trip.price && <p className="text-[10px] opacity-40 font-medium">${trip.price}/L</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${trip.mileage > 15 ? 'bg-emerald-500/10 text-emerald-600' :
                                                trip.mileage > 10 ? 'bg-blue-500/10 text-blue-600' :
                                                    'bg-red-500/10 text-red-600'
                                            }`}>
                                            {trip.mileage.toFixed(2)} km/L
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onDelete(trip.id)}
                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors inline-block"
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
