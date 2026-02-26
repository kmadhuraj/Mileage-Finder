import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation2, Plus, Trash2, Info, Gauge, ListChecks } from 'lucide-react';
import type { Stats, RouteReport } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default Leaflet icons
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

interface Waypoint {
    id: string;
    address: string;
}

const RoutingMachine = ({ waypoints, onRouteFound }: { waypoints: L.LatLng[], onRouteFound: (distance: number, time: number) => void }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints,
            lineOptions: {
                styles: [{ color: '#3b82f6', weight: 4, opacity: 0.7 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: true,
            fitSelectedRoutes: true,
        }).addTo(map);

        routingControl.on('routesfound', (e) => {
            const routes = e.routes;
            if (routes && routes.length > 0) {
                const distance = routes[0].summary.totalDistance / 1000; // in km
                const time = routes[0].summary.totalTime; // in seconds
                onRouteFound(distance, time);
            }
        });

        return () => {
            if (map && routingControl) {
                map.removeControl(routingControl);
            }
        };
    }, [map, waypoints]);

    return null;
};

export const RoutePlanner: React.FC<Props> = ({ stats }) => {
    const [stops, setStops] = useState<Waypoint[]>([
        { id: '1', address: '' },
        { id: '2', address: '' }
    ]);
    const [report, setReport] = useState<RouteReport | null>(null);
    const [resolvedWaypoints, setResolvedWaypoints] = useState<L.LatLng[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);

    const addStop = () => {
        const newStop = { id: Math.random().toString(36).substr(2, 9), address: '' };
        setStops([...stops, newStop]);
    };

    const removeStop = (id: string) => {
        if (stops.length <= 2) return;
        setStops(stops.filter(s => s.id !== id));
    };

    const updateStop = (id: string, address: string) => {
        setStops(stops.map(s => s.id === id ? { ...s, address } : s));
    };

    const geocodeAddress = async (address: string): Promise<L.LatLng | null> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return null;
    };

    const calculateRoute = async () => {
        if (!stops[0].address || !stops[stops.length - 1].address) return;

        setIsCalculating(true);
        const coords: L.LatLng[] = [];

        for (const stop of stops) {
            if (stop.address) {
                const result = await geocodeAddress(stop.address);
                if (result) coords.push(result);
            }
        }

        if (coords.length >= 2) {
            setResolvedWaypoints(coords);
        } else {
            alert('Please provide at least two valid addresses');
            setIsCalculating(false);
        }
    };

    const handleRouteFound = (distance: number, timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const eta = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        const fuelNeeded = distance / (stats.averageMileage || 15);
        const bestFuelNeeded = distance / (stats.bestMileage || 18);
        const fuelSavings = Math.max(0, fuelNeeded - bestFuelNeeded);
        const expense = fuelNeeded * 1.8;

        const recommendations = [
            `Maintain a steady speed of 60-80 km/h for optimal efficiency.`,
            `Your current average is ${stats.averageMileage.toFixed(1)} km/L. Driving at your personal best performance (${stats.bestMileage.toFixed(1)} km/L) could save you up to ${fuelSavings.toFixed(1)} L of fuel on this trip.`,
            `Check tire pressure and avoid aggressive acceleration on this ${distance.toFixed(0)}km journey.`
        ];

        if (distance > 200) {
            recommendations.push("Plan a coffee break every 100km to stay alert.");
        }

        setReport({
            distance: Number(distance.toFixed(1)),
            eta,
            expense: Number(expense.toFixed(2)),
            fuelNeeded: Number(fuelNeeded.toFixed(1)),
            recommendations
        });
        setIsCalculating(false);
    };

    const defaultCenter: LatLngExpression = [51.505, -0.09];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Route Inputs */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Navigation2 className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-lg">Route Search</h3>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {stops.map((stop, index) => (
                                    <motion.div
                                        key={stop.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group"
                                    >
                                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-blue-500/20 rounded-full" />
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase opacity-50 font-bold mb-1 ml-1">
                                                    {index === 0 ? 'Start' : index === stops.length - 1 ? 'Destination' : `Stop ${index}`}
                                                </p>
                                                <input
                                                    type="text"
                                                    value={stop.address}
                                                    onChange={(e) => updateStop(stop.id, e.target.value)}
                                                    placeholder="Enter location address..."
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                            </div>
                                            {stops.length > 2 && (
                                                <button
                                                    onClick={() => removeStop(stop.id)}
                                                    className="mt-5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <button
                                onClick={addStop}
                                className="w-full p-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Waypoint
                            </button>
                            <button
                                onClick={calculateRoute}
                                disabled={isCalculating}
                                className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${isCalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isCalculating ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Navigation2 className="w-4 h-4" />
                                )}
                                {isCalculating ? 'Calculating...' : 'Calculate Route'}
                            </button>
                        </div>
                    </div>

                    {report && (
                        <div className="glass-card p-6 bg-blue-500/5 border-blue-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Gauge className="w-5 h-5 text-blue-500" />
                                <h4 className="font-bold">Trip Efficiency</h4>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Optimum Speed</span>
                                    <span className="font-bold text-emerald-500">60 - 80 km/h</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Est. Fuel Consum.</span>
                                    <span className="font-bold">{report.fuelNeeded} L</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                                    <p className="text-xs text-slate-500 italic flex gap-2">
                                        <Info className="w-4 h-4 shrink-0" />
                                        Driving at {stats.averageMileage.toFixed(1)} km/L average.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right side: Map and Results */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card overflow-hidden h-[500px] relative z-0">
                        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {resolvedWaypoints.length > 0 && <RoutingMachine waypoints={resolvedWaypoints} onRouteFound={handleRouteFound} />}
                            {resolvedWaypoints.map((pos, idx) => (
                                <Marker key={idx} position={pos}>
                                    <Popup>{idx === 0 ? 'Origin' : idx === resolvedWaypoints.length - 1 ? 'Destination' : `Stop ${idx}`}</Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    <AnimatePresence>
                        {report && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                <div className="glass-card p-4 flex flex-col justify-center">
                                    <p className="text-[10px] uppercase opacity-50 font-bold">Total Distance</p>
                                    <p className="text-xl font-black">{report.distance} <span className="text-sm font-normal">km</span></p>
                                </div>
                                <div className="glass-card p-4 flex flex-col justify-center">
                                    <p className="text-[10px] uppercase opacity-50 font-bold">Estimated Time</p>
                                    <p className="text-xl font-black">{report.eta}</p>
                                </div>
                                <div className="glass-card p-4 flex flex-col justify-center">
                                    <p className="text-[10px] uppercase opacity-50 font-bold">Fuel Cost</p>
                                    <p className="text-xl font-black">${report.expense}</p>
                                </div>
                                <div className="glass-card p-4 flex flex-col justify-center">
                                    <p className="text-[10px] uppercase opacity-50 font-bold">Fuel Needed</p>
                                    <p className="text-xl font-black">{report.fuelNeeded} <span className="text-sm font-normal">L</span></p>
                                </div>

                                <div className="col-span-2 md:col-span-4 glass-card p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ListChecks className="w-5 h-5 text-blue-500" />
                                        <h4 className="font-bold">Recommendations for Best Mileage</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {report.recommendations.map((rec, i) => (
                                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex gap-3 text-sm border border-slate-100 dark:border-slate-800">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                {rec}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
