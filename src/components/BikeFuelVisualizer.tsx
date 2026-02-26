import React, { useState } from 'react';
import { Gauge, Zap, AlertTriangle, TrendingDown, Info } from 'lucide-react';
import type { Stats } from '../types';

interface Props {
    stats: Stats;
}

interface FuelLevel {
    bars: number | 'Blinking';
    fuel: number;
    label: string;
}

const FUEL_MAP: FuelLevel[] = [
    { bars: 7, fuel: 12.0, label: 'Full' },
    { bars: 6, fuel: 10.5, label: '~10.5 L' },
    { bars: 5, fuel: 9.0, label: '~9 L' },
    { bars: 4, fuel: 7.0, label: '~7 L' },
    { bars: 3, fuel: 5.5, label: '~5.5 L' },
    { bars: 2, fuel: 4.0, label: '~4 L' },
    { bars: 1, fuel: 2.0, label: '~2 L' },
    { bars: 'Blinking', fuel: 1.0, label: 'Reserve' },
];

export const BikeFuelVisualizer: React.FC<Props> = ({ stats }) => {
    const [selectedBars, setSelectedBars] = useState<number | 'Blinking'>(7);

    const currentFuel = FUEL_MAP.find(f => f.bars === selectedBars)?.fuel || 0;
    const avgMileage = stats.averageMileage || 45; // Default for Hornet 2.0 if no stats
    const bestMileage = stats.bestMileage || 50;

    const estRange = currentFuel * avgMileage;
    const bestRange = currentFuel * bestMileage;

    // Consumption rates at different speeds (Mock logic based on bike physics)
    // Speed: km/h, Multiplier: efficiency factor (1.0 = avg)
    const speedProfiles = [
        { speed: 40, label: 'City', multiplier: 0.85, color: 'text-amber-500' },
        { speed: 65, label: 'Economy', multiplier: 1.1, color: 'text-emerald-500' },
        { speed: 90, label: 'High Speed', multiplier: 0.7, color: 'text-red-500' },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
                <Gauge className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-lg">Hornet 2.0 Fuel Analytics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fuel Gauge Selector */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-4">Select Fuel Bars (Digital Console)</p>
                        <div className="flex items-end gap-1.5 h-24 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                                <button
                                    key={bar}
                                    onClick={() => setSelectedBars(bar)}
                                    className={`flex-1 rounded-sm transition-all duration-300 ${selectedBars !== 'Blinking' && selectedBars >= bar
                                        ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    style={{ height: `${(bar / 7) * 100}%` }}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedBars('Blinking')}
                            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${selectedBars === 'Blinking'
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}
                        >
                            <AlertTriangle className="w-4 h-4" />
                            RESERVE (Blinking)
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Current Fuel</p>
                            <p className="text-xl font-black text-blue-500">{currentFuel} L</p>
                        </div>
                        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Est. Range</p>
                            <p className="text-xl font-black text-emerald-500">~{estRange.toFixed(0)} km</p>
                        </div>
                    </div>
                </div>

                {/* Range & Speed Analysis */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-purple-500" />
                        Drain Rate vs Speed
                    </h4>

                    <div className="space-y-3">
                        {speedProfiles.map((profile) => {
                            const rangeAtSpeed = currentFuel * (avgMileage * profile.multiplier);
                            return (
                                <div key={profile.speed} className="p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${profile.color}`}>
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{profile.speed} km/h</p>
                                            <p className="text-[10px] text-slate-400">{profile.label}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm">{rangeAtSpeed.toFixed(0)} km</p>
                                        <p className="text-[10px] text-slate-400 text-xs">Total Range</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                        <p className="font-bold flex items-center gap-2 mb-1">
                            <Info className="w-4 h-4" />
                            Pro Tip for Hornet 2.0
                        </p>
                        <p className="opacity-80">
                            Cruising at 60-70 km/h can extend your range to {bestRange.toFixed(0)} km on current fuel. Sudden acceleration drains fuel 25% faster.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
