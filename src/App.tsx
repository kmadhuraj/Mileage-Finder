import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { MileageCalculator } from './components/MileageCalculator';
import { TripHistory } from './components/TripHistory';
import { TrendChart } from './components/TrendChart';
import { Alerts } from './components/Alerts';
import { RoutePlanner } from './components/RoutePlanner';
import { BikeFuelVisualizer } from './components/BikeFuelVisualizer';
import { FloatingSpeedometer } from './components/FloatingSpeedometer';
import { useTrips } from './hooks/useTrips';

function App() {
  const { trips, stats, addTrip, deleteTrip, clearHistory } = useTrips();

  const lastEndOdo = trips.length > 0 ? trips[0].endOdometer : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Analytics Overview */}
        <section className="grid grid-cols-1 gap-8">
          <StatsCards stats={stats} />
          <BikeFuelVisualizer stats={stats} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Action Center: Entry Form & Alerts */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6 self-start">
            <MileageCalculator onAdd={addTrip} lastEndOdo={lastEndOdo} />
            <Alerts trips={trips} />
          </div>

          {/* Visual Insights & Routing */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <RoutePlanner stats={stats} />
            </section>

            <section>
              <TrendChart trips={trips} />
            </section>

            <section>
              <TripHistory
                trips={trips}
                onDelete={deleteTrip}
                onClear={clearHistory}
              />
            </section>
          </div>
        </div>
      </main>

      <FloatingSpeedometer />

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} EcoDrive - The Ultimate Fuel Tracker</p>
      </footer>
    </div>
  );
}

export default App;
