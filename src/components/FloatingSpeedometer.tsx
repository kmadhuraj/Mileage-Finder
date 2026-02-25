import React, { useState, useEffect } from 'react';
import { Gauge, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingSpeedometer: React.FC = () => {
    const [speed, setSpeed] = useState<number | null>(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    // speed is in m/s, convert to km/h
                    const kmh = position.coords.speed ? position.coords.speed * 3.6 : 0;
                    setSpeed(kmh);
                    if (kmh > 0) setIsVisible(true);
                },
                (error) => console.error(error),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    return (
        <AnimatePresence>
            {(isVisible || speed! > 0) && (
                <motion.div
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 50 }}
                    className="fixed bottom-6 right-6 z-[100] group"
                    onMouseEnter={() => setIsVisible(true)}
                    onMouseLeave={() => speed! === 0 && setIsVisible(false)}
                >
                    <div className="relative">
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-150"></div>

                        <div className="glass-card !rounded-full p-4 flex flex-col items-center justify-center w-24 h-24 border-2 border-blue-500 shadow-2xl shadow-blue-500/40">
                            <Gauge className="w-5 h-5 text-blue-500 mb-1" />
                            <span className="text-2xl font-black">{Math.round(speed! || 0)}</span>
                            <span className="text-[10px] uppercase tracking-tighter opacity-50 font-bold">km/h</span>
                        </div>

                        <div className="absolute -top-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg">
                            <Navigation className="w-3 h-3 text-white fill-current animate-pulse" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
