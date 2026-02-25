export interface WeatherInfo {
    temp: number;
    condition: string;
    icon: string;
}

export interface LocationInfo {
    address: string;
    lat?: number;
    lng?: number;
}

export interface Trip {
    id: string;
    date: string;
    startOdometer?: number;
    endOdometer?: number;
    distance: number; // calculated or manual
    fuel: number; // litres
    price?: number; // fuel price per litre
    totalFuelCapacity?: number;
    mileage: number; // km/L
    costPerKm?: number;
    location?: LocationInfo;
    weather?: WeatherInfo;
    notes?: string;
}

export interface Stats {
    averageMileage: number;
    bestMileage: number;
    lowestMileage: number;
    totalDistance: number;
    totalFuel: number;
    totalCost: number;
    projectedRange?: number;
}

export interface RouteReport {
    distance: number;
    eta: string;
    expense: number;
    fuelNeeded: number;
    recommendations: string[];
}
