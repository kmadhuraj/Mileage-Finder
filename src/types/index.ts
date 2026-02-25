export interface Trip {
    id: string;
    date: string;
    distance: number; // km
    fuel: number; // litres
    price?: number; // fuel price per litre
    mileage: number; // km/L
    costPerKm?: number;
    totalFuelCapacity?: number; // litres
}

export interface Stats {
    averageMileage: number;
    bestMileage: number;
    lowestMileage: number;
    totalDistance: number;
    totalFuel: number;
    totalCost: number;
}
