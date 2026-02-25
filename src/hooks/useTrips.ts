import { useMemo } from 'react';
import type { Trip, Stats } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useTrips() {
    const [trips, setTrips] = useLocalStorage<Trip[]>('mileage-trips', []);

    const addTrip = (trip: Omit<Trip, 'id' | 'mileage' | 'costPerKm'>) => {
        const mileage = trip.distance / trip.fuel;
        const costPerKm = trip.price ? (trip.fuel * trip.price) / trip.distance : undefined;

        const newTrip: Trip = {
            ...trip,
            id: crypto.randomUUID(),
            mileage,
            costPerKm,
        };

        setTrips([newTrip, ...trips]);
    };

    const deleteTrip = (id: string) => {
        setTrips(trips.filter((t) => t.id !== id));
    };

    const clearHistory = () => {
        setTrips([]);
    };

    const stats = useMemo<Stats>(() => {
        if (trips.length === 0) {
            return {
                averageMileage: 0,
                bestMileage: 0,
                lowestMileage: 0,
                totalDistance: 0,
                totalFuel: 0,
                totalCost: 0,
            };
        }

        const mileages = trips.map((t) => t.mileage);
        const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
        const totalFuel = trips.reduce((sum, t) => sum + t.fuel, 0);
        const totalCost = trips.reduce((sum, t) => sum + (t.fuel * (t.price || 0)), 0);

        return {
            averageMileage: totalDistance / totalFuel,
            bestMileage: Math.max(...mileages),
            lowestMileage: Math.min(...mileages),
            totalDistance,
            totalFuel,
            totalCost,
        };
    }, [trips]);

    return {
        trips,
        stats,
        addTrip,
        deleteTrip,
        clearHistory,
    };
}
