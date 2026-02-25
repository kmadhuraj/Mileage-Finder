import React, { useState, useEffect } from 'react';
import { PlusCircle, Calculator, MapPin, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReceiptScanner } from './ReceiptScanner';

interface Props {
    onAdd: (trip: any) => void;
    lastEndOdo?: number;
}

export const MileageCalculator: React.FC<Props> = ({ onAdd, lastEndOdo }) => {
    const [distance, setDistance] = useState('');
    const [fuel, setFuel] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [startOdo, setStartOdo] = useState(lastEndOdo?.toString() || '');
    const [endOdo, setEndOdo] = useState('');

    useEffect(() => {
        if (lastEndOdo) setStartOdo(lastEndOdo.toString());
    }, [lastEndOdo]);
    const [location, setLocation] = useState<any>(null);
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        // Simple geolocation and mock weather
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: 'Current Location'
                });
                // Mock weather fetch
                setWeather({
                    temp: 24,
                    condition: 'Sunny',
                    icon: 'sun'
                });
            });
        }
    }, []);

    const handleScanResult = (data: any) => {
        if (data.fuel) setFuel(data.fuel.toString());
        if (data.price) setPrice(data.price.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const tripData: any = {
            fuel: Number(fuel),
            price: price ? Number(price) : undefined,
            totalFuelCapacity: capacity ? Number(capacity) : undefined,
            startOdometer: startOdo ? Number(startOdo) : undefined,
            endOdometer: endOdo ? Number(endOdo) : undefined,
            distance: distance ? Number(distance) : undefined,
            location,
            weather,
            date: new Date().toISOString(),
        };

        onAdd(tripData);

        setDistance('');
        setFuel('');
        setPrice('');
        setCapacity('');
        setStartOdo('');
        setEndOdo('');
    };

    const calculatedDistance = (startOdo && endOdo) ? (Number(endOdo) - Number(startOdo)) : Number(distance);
    const calculatedMileage = calculatedDistance && fuel ? (calculatedDistance / Number(fuel)).toFixed(2) : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 lg:sticky lg:top-24"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Calculator className="w-6 h-6" />
                    <h2 className="text-xl font-bold">New Entry</h2>
                </div>
                {weather && (
                    <div className="flex items-center gap-2 text-xs opacity-60 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        <Wind className="w-3 h-3" />
                        <span>{weather.temp}°C {weather.condition}</span>
                    </div>
                )}
            </div>

            <ReceiptScanner onScan={handleScanResult} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">Start ODO</label>
                        <input
                            type="number"
                            value={startOdo}
                            onChange={(e) => setStartOdo(e.target.value)}
                            placeholder="e.g. 10200"
                            className="input-field"
                            step="any"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">End ODO</label>
                        <input
                            type="number"
                            value={endOdo}
                            onChange={(e) => setEndOdo(e.target.value)}
                            placeholder="e.g. 10500"
                            className="input-field"
                            step="any"
                        />
                    </div>
                </div>

                {!startOdo && (
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">Manual Distance (km)</label>
                        <input
                            type="number"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="e.g. 450"
                            className="input-field"
                            step="any"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">Fuel (Litres)</label>
                        <input
                            type="number"
                            value={fuel}
                            onChange={(e) => setFuel(e.target.value)}
                            placeholder="e.g. 35"
                            className="input-field"
                            required
                            step="any"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 opacity-70">Price/Litre</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 1.85"
                            className="input-field"
                            step="any"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs opacity-60">
                    <MapPin className="w-3 h-3" />
                    <span>Location: {location?.address || 'Detecting...'}</span>
                </div>

                {calculatedMileage && (
                    <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-sm opacity-70">Projected Mileage</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{calculatedMileage} km/L</p>
                    </div>
                )}

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Record Trip
                </button>
            </form>
        </motion.div>
    );
};
