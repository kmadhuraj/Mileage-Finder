import React, { useState } from 'react';
import { PlusCircle, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    onAdd: (trip: {
        distance: number;
        fuel: number;
        price?: number;
        totalFuelCapacity?: number;
        date: string;
    }) => void;
}

export const MileageCalculator: React.FC<Props> = ({ onAdd }) => {
    const [distance, setDistance] = useState('');
    const [fuel, setFuel] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!distance || !fuel) return;

        onAdd({
            distance: Number(distance),
            fuel: Number(fuel),
            price: price ? Number(price) : undefined,
            totalFuelCapacity: capacity ? Number(capacity) : undefined,
            date: new Date().toISOString(),
        });

        setDistance('');
        setFuel('');
        setPrice('');
        setCapacity('');
    };

    const calculatedMileage = distance && fuel ? (Number(distance) / Number(fuel)).toFixed(2) : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 lg:sticky lg:top-24"
        >
            <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <Calculator className="w-6 h-6" />
                <h2 className="text-xl font-bold">New Entry</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-1.5 opacity-70">Distance Travelled (km)</label>
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="e.g. 450"
                        className="input-field"
                        required
                        step="any"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 opacity-70">Fuel Used (Litres)</label>
                    <input
                        type="number"
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        placeholder="e.g. 35.5"
                        className="input-field"
                        required
                        step="any"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 opacity-70">Fuel Price (Optional, per Litre)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 1.85"
                        className="input-field"
                        step="any"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 opacity-70">Total Tank Capacity (Optional, Litres)</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="e.g. 50"
                        className="input-field"
                        step="any"
                    />
                </div>

                {calculatedMileage && (
                    <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-sm opacity-70">Projected Mileage</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculatedMileage} km/L</p>
                    </div>
                )}

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                    <PlusCircle className="w-5 h-5" />
                    Add Record
                </button>
            </form>
        </motion.div>
    );
};
