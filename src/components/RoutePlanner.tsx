import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as MapIcon, Navigation2, Fuel, Clock, DollarSign, ListChecks } from 'lucide-react';
import type { Stats, RouteReport } from '../types';
import { motion } from 'framer-motion';
import type { LatLngExpression } from 'leaflet';

import * as L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
    stats: Stats;
}

export const RoutePlanner: React.FC<Props> = ({ stats }) => {
    const [report, setReport] = useState<RouteReport | null>(null);

    const generateReport = () => {
        const distance = 150 + Math.random() * 50;
        const fuelNeeded = distance / (stats.averageMileage || 15);
        const expense = fuelNeeded * 1.8;

        setReport({
            distance: Number(distance.toFixed(1)),
            eta: '2h 15m',
            expense: Number(expense.toFixed(2)),
            fuelNeeded: Number(fuelNeeded.toFixed(1)),
            recommendations: [
                'Station A: $1.75/L (Cheapest)',
                'Station B: 15km ahead (On route)',
                'Stop at 80km for coffee recommended'
            ]
        });
    };

    const center: LatLngExpression = [51.505, -0.09];
    const stationPos: LatLngExpression = [51.52, -0.1];

    return (
        <div className="space-y-6">
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-lg">Route & Station Finder</h3>
                    </div>
                    <button onClick={generateReport} className="btn-primary !py-2 text-sm flex items-center gap-2">
                        <Navigation2 className="w-4 h-4" />
                        Plan Route
                    </button>
                </div>

                <div className="h-[400px] relative z-0">
                    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={center}>
                            <Popup>Your current location</Popup>
                        </Marker>
                        <Marker position={stationPos}>
                            <Popup>Fuel Station (Shell) - $1.78/L</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>

            {report && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <div className="glass-card p-4 flex gap-4 items-center">
                        <div className="p-3 bg-blue-500/10 rounded-xl"><MapIcon className="w-5 h-5 text-blue-500" /></div>
                        <div><p className="text-[10px] uppercase opacity-50 font-bold">Distance</p><p className="font-bold">{report.distance} km</p></div>
                    </div>
                    <div className="glass-card p-4 flex gap-4 items-center">
                        <div className="p-3 bg-amber-500/10 rounded-xl"><Clock className="w-5 h-5 text-amber-500" /></div>
                        <div><p className="text-[10px] uppercase opacity-50 font-bold">ETA</p><p className="font-bold">{report.eta}</p></div>
                    </div>
                    <div className="glass-card p-4 flex gap-4 items-center">
                        <div className="p-3 bg-emerald-500/10 rounded-xl"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                        <div><p className="text-[10px] uppercase opacity-50 font-bold">Expense</p><p className="font-bold">${report.expense}</p></div>
                    </div>
                    <div className="glass-card p-4 flex gap-4 items-center">
                        <div className="p-3 bg-purple-500/10 rounded-xl"><Fuel className="w-5 h-5 text-purple-500" /></div>
                        <div><p className="text-[10px] uppercase opacity-50 font-bold">Fuel Needed</p><p className="font-bold">{report.fuelNeeded} L</p></div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-4 glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ListChecks className="w-5 h-5 text-blue-500" />
                            <h4 className="font-bold">Recommendations</h4>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {report.recommendations.map((rec, i) => (
                                <li key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-100 dark:border-slate-700">
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
