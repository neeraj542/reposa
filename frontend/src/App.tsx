import { useState, useRef, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import SignupPage from './components/SignupPage';

import { api } from './api/client';
import type { Analysis } from './types';
import { FiGithub, FiSun, FiMoon, FiClock, FiTarget, FiUsers, FiTrendingUp, FiCode, FiBook, FiZap } from 'react-icons/fi';
import { useTheme } from './contexts/ThemeContext';
import './index.css';

function App() {
  const [view, setView] = useState<'home' | 'signup'>('home');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };



  const handleSearch = async (repoUrl: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await api.analyzeRepository(repoUrl);
      setAnalysis(result);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        'Failed to analyze repository. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysis && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [analysis]);

  if (view === 'signup') {
    return <SignupPage onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme === 'dark' ? '#0a0a0a' : '#f4f4f4' }}>
      {/* Floating Pill Navbar */}
      <header className="sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <nav
            className="flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300"
            style={{
              background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            {/* Logo Left */}
            <div className="flex items-center gap-2">
              <img
                src="/st1.svg"
                alt="Reposa"
                className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform duration-300"
                style={{ filter: theme === 'light' ? 'brightness(0.8)' : 'none' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
              <span
                className="font-bold text-lg cursor-pointer"
                style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Reposa
              </span>
            </div>

            {/* Nav Links Center */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: theme === 'dark' ? '#999999' : '#666666' }}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: theme === 'dark' ? '#999999' : '#666666' }}
              >
                Why Reposa
              </button>
              <button
                onClick={() => scrollToSection('use-cases')}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: theme === 'dark' ? '#999999' : '#666666' }}
              >
                Use Cases
              </button>
            </div>

            {/* CTAs Right */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors duration-200"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun style={{ color: '#ffffff' }} className="text-lg" />
                ) : (
                  <FiMoon style={{ color: '#000000' }} className="text-lg" />
                )}
              </button>

              {/* Get Started CTA */}
              <button
                onClick={() => setView('signup')}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: '#000000',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">


        {/* Error Message */}
        {error && (
          <div className="glass-card p-6 sm:p-8 mb-12 border-l-4 border-red-500/50 bg-red-500/5 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-red-500/10 rounded-lg">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-300 mb-2">Error</h3>
                <p className="text-red-200/80 text-sm leading-relaxed">{error}</p>
                <button onClick={() => setError(null)} className="mt-4 text-xs text-red-300 hover:text-red-200 underline">Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass-card p-8">
              <div className="animate-pulse">
                <div className="h-8 rounded-lg w-2/3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                <div className="h-4 rounded-lg w-full mb-2" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                <div className="h-4 rounded-lg w-4/5 mb-6" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                <div className="flex gap-4">
                  <div className="h-6 rounded-lg w-24" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                  <div className="h-6 rounded-lg w-24" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing repository...
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div ref={resultsRef}>
            <ResultsDisplay analysis={analysis} />
          </div>
        )}

        {/* Empty State - Bold E2B-inspired Hero */}
        {!analysis && !loading && !error && (
          <div className="text-center hero-glow animate-fade-in-up py-16 sm:py-24">
            {/* Hero Content */}
            <div className="mb-16">
              {/* Logo Icon */}


              {/* Hero Single Card */}
              <div
                className="max-w-4xl mx-auto p-12 rounded-[32px] text-center shadow-sm relative overflow-hidden"
                style={{
                  background: theme === 'dark' ? '#18181b' : '#ffffff',
                  boxShadow: theme === 'dark' ? '0 4px 24px rgba(0,0,0,0.2)' : '0 4px 24px rgba(0,0,0,0.06)'
                }}
              >
                <div className="relative z-10">
                  <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
                    Drop a Repo, Get the Goods
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                    Paste any GitHub repo and we'll dig up every beginner-friendly issue worth tackling
                  </p>

                  <SearchForm onSearch={handleSearch} loading={loading} />
                </div>
              </div>
            </div>

            {/* Feature Grid - Cards */}
            <div id="features" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1 */}
              <div
                className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                  <FiClock className="text-2xl text-black dark:text-white" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Auto-Sorted Issues</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  We sort everything by difficulty, type, language, and whether there's a mentor waiting to help you.
                </p>
              </div>

              {/* Card 2 */}
              <div
                className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                  <FiTarget className="text-2xl text-black dark:text-white" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Color-Coded Labels</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  Spot what you need instantly with clear badges showing issue type, skills needed, and project info.
                </p>
              </div>

              {/* Card 3 */}
              <div
                className="p-8 text-left sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                  <FiTrendingUp className="text-2xl text-black dark:text-white" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">The Full Picture</h3>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                  See exactly how many bugs, features, and newbie-friendly issues are up for grabs at a glance.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Benefits Section */}
      {!analysis && !loading && !error && (
        <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Why Reposa?
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              Stop wasting hours hunting for good first issues. We do the heavy lifting so you can focus on coding.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiClock, title: 'Save Time', desc: 'No more endless scrolling through issue lists. Get sorted results instantly.' },
              { icon: FiTarget, title: 'Find Your Level', desc: 'Filter by difficulty to find issues that match your skill level perfectly.' },
              { icon: FiUsers, title: 'Get Mentored', desc: 'Spot issues with mentors ready to guide you through your first PR.' },
              { icon: FiTrendingUp, title: 'Track Progress', desc: 'See exactly what\'s available and track your contribution journey.' }
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 text-center transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                  <item.icon className="text-2xl text-black dark:text-white" />
                </div>
                <h3 className="font-bold mb-3 text-lg text-black dark:text-white tracking-tight">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      {!analysis && !loading && !error && (
        <section id="use-cases" className="max-w-7xl mx-auto px-4 sm:px-8 py-24 pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white tracking-tight">
              Perfect For Everyone
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              Whether you're just starting out or a seasoned pro, Reposa helps you contribute smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* First-Time Contributors */}
            <div
              className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                <FiZap className="text-2xl text-black dark:text-white" />
              </div>
              <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">First-Time Contributors</h3>
              <p className="text-base leading-relaxed mb-6 text-gray-600 dark:text-gray-400">
                Find beginner-friendly issues with clear labels and mentor support. Start your open source journey the right way.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Easy Issues</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Mentor Support</span>
              </div>
            </div>

            {/* Experienced Developers */}
            <div
              className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                <FiCode className="text-2xl text-black dark:text-white" />
              </div>
              <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Experienced Developers</h3>
              <p className="text-base leading-relaxed mb-6 text-gray-600 dark:text-gray-400">
                Skip the noise and jump straight to meaty bugs and features that match your expertise.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Medium Issues</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Hard Issues</span>
              </div>
            </div>

            {/* Project Maintainers */}
            <div
              className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                <FiBook className="text-2xl text-black dark:text-white" />
              </div>
              <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Project Maintainers</h3>
              <p className="text-base leading-relaxed mb-6 text-gray-600 dark:text-gray-400">
                See how welcoming your repo is to new contributors. Improve your issue labels and onboarding.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Analytics</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">Insights</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Minimalist Footer */}
      <footer className="border-t mt-24 sm:mt-32" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-2">
              <img src="/st1.svg" alt="Reposa" className="w-5 h-5" style={{ filter: theme === 'light' ? 'brightness(0.8)' : 'none' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Built by <a href="https://github.com/neeraj542" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Neeraj</a>
              </p>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-6">
              <a href="https://github.com/neeraj542/reposa" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                Open Source
              </a>
              <a href="https://github.com/neeraj542/reposa/graphs/contributors" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                Contributors
              </a>
              <a href="https://github.com/neeraj542" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                <FiGithub className="text-base" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
