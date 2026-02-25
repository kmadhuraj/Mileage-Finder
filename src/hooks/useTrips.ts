import { useMemo } from 'react';
import type { Trip, Stats } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useTrips() {
    const [trips, setTrips] = useLocalStorage<Trip[]>('mileage-trips', []);

    const addTrip = (trip: Omit<Trip, 'id' | 'mileage' | 'costPerKm' | 'distance'> & { distance?: number }) => {
        // Calculate distance from odometer if provided
        const calculatedDistance = (trip.startOdometer !== undefined && trip.endOdometer !== undefined)
            ? trip.endOdometer - trip.startOdometer
            : (trip.distance || 0);

        const mileage = calculatedDistance > 0 && trip.fuel > 0 ? calculatedDistance / trip.fuel : 0;
        const costPerKm = trip.price && calculatedDistance > 0 ? (trip.fuel * trip.price) / calculatedDistance : undefined;

        const newTrip: Trip = {
            ...trip,
            id: crypto.randomUUID(),
            distance: calculatedDistance,
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

        const mileages = trips.map((t) => t.mileage).filter(m => m > 0);
        const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
        const totalFuel = trips.reduce((sum, t) => sum + t.fuel, 0);
        const totalCost = trips.reduce((sum, t) => sum + (t.fuel * (t.price || 0)), 0);

        return {
            averageMileage: totalFuel > 0 ? totalDistance / totalFuel : 0,
            bestMileage: mileages.length > 0 ? Math.max(...mileages) : 0,
            lowestMileage: mileages.length > 0 ? Math.min(...mileages) : 0,
            totalDistance,
            totalFuel,
            totalCost,
            projectedRange: mileages.length > 0 ? (totalDistance / totalFuel) * 50 : 0, // Mock projected range based on 50L tank
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
