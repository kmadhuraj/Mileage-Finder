import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { MileageCalculator } from './components/MileageCalculator';
import { TripHistory } from './components/TripHistory';
import { TrendChart } from './components/TrendChart';
import { Alerts } from './components/Alerts';
import { useTrips } from './hooks/useTrips';

function App() {
  const { trips, stats, addTrip, deleteTrip, clearHistory } = useTrips();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <section>
          <StatsCards stats={stats} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Form & Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <MileageCalculator onAdd={addTrip} />
            <Alerts trips={trips} />
          </div>

          {/* Right Column: Analytics & History */}
          <div className="lg:col-span-2 space-y-8">
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

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} EcoDrive - Modern Mileage Finder & Fuel Tracker</p>
      </footer>
    </div>
  );
}

export default App;
