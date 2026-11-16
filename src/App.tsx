import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { VasoactiveCalculator } from '@/components/VasoactiveCalculator';
import { VentilationCalculator } from '@/components/VentilationCalculator';
import { Footer } from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 transition-colors duration-300 dark:bg-ink-950 dark:text-white">
      <Header theme={theme} toggleTheme={toggle} />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Hero />
        <VasoactiveCalculator />
        <VentilationCalculator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
