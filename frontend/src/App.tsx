import { useState, useRef, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingState from './components/LoadingState';

import { api, CustomApiError } from './api/client';
import type { Analysis } from './types';
import { FiGithub, FiSun, FiMoon, FiClock, FiTarget, FiUsers, FiTrendingUp, FiCode, FiBook, FiZap } from 'react-icons/fi';
import { useTheme } from './contexts/ThemeContext';
import './index.css';

function App() {
  const [view, setView] = useState<'home' | 'signup' | 'login'>('home');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    type: 'repo_not_found' | 'no_issues' | 'no_beginner_issues' | 'api_error' | 'network_error' | null;
    message: string;
  } | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string>('');

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

    // Extract repo name for loading display
    const repoName = repoUrl.split('/').slice(-2).join('/');
    setCurrentRepoName(repoName);

    try {
      // Create a promise that resolves after 2.5 seconds
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2500));

      // Execute both the analysis and the delay concurrently
      const [result] = await Promise.all([
        api.analyzeRepository(repoUrl),
        delayPromise
      ]);

      setAnalysis(result);
    } catch (err: unknown) {
      console.error('Analysis error:', err);

      if (err instanceof CustomApiError) {
        setError({
          type: (err as CustomApiError).errorType as 'repo_not_found' | 'no_issues' | 'no_beginner_issues' | 'api_error' | 'network_error' | null,
          message: (err as CustomApiError).userMessage
        });
      } else {
        setError({
          type: 'api_error',
          message: 'An unexpected error occurred. Please try again.'
        });
      }
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
    return <SignupPage onBack={() => setView('home')} onLogin={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginPage onBack={() => setView('home')} onSignup={() => setView('signup')} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: theme === 'dark' ? '#0a0a0a' : '#f4f4f4' }}>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 flex-grow">


        {/* Error Display */}
        {error && (
          <ErrorDisplay
            errorType={error.type}
            message={error.message}
            onTryAgain={() => setError(null)}
            onGoBack={() => {
              setError(null);
              setAnalysis(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBrowsePopular={() => {
              setError(null);
              const popularSection = document.querySelector('.popular-picks');
              popularSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}


        {/* Results */}
        {analysis && !loading && (
          <div ref={resultsRef}>
            <ResultsDisplay analysis={analysis} onBack={() => {
              setAnalysis(null);
              setCurrentRepoName('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>
        )}

        {/* Empty State - Bold E2B-inspired Hero */}
        {
          !analysis && !error && (
            <div className="text-center hero-glow animate-fade-in-up py-16 sm:py-24">
              {/* Hero Content */}
              <div className="mb-16">
                {/* Logo Icon */}


                {/* Hero Single Card */}
                <div
                  className="max-w-4xl mx-auto p-12 rounded-[32px] text-center shadow-sm relative overflow-hidden animate-scan"
                  style={{
                    background: theme === 'dark' ? '#18181b' : '#ffffff',
                    boxShadow: theme === 'dark' ? '0 4px 24px rgba(0,0,0,0.2)' : '0 44px 24px rgba(0,0,0,0.06)'
                  }}
                >
                  <div className="relative z-10">
                    <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
                      Drop a Repo, Get the Goods
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                      Paste any GitHub repo and we'll dig up every beginner-friendly issue worth tackling
                    </p>

                    <SearchForm
                      onSearch={handleSearch}
                      loading={loading}
                      renderLoading={<LoadingState repositoryName={currentRepoName} />}
                    />
                  </div>
                </div>
              </div>

              {/* Sponsor & Star Section */}
              <div className="max-w-6xl mx-auto mb-24 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left flex-1">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">Support the Mission</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md">
                      Reposa is open source. Star us on GitHub or sponsor the project to help us scan thousands of more repos.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    <a
                      href="https://github.com/neeraj542/reposa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-all shadow-lg"
                    >
                      <FiGithub className="text-lg" />
                      Star on GitHub
                    </a>
                    <a
                      href="https://github.com/sponsors/neeraj542"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-full border border-rose-200 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 font-bold text-sm hover:scale-105 transition-all"
                    >
                      <FiZap className="text-lg" />
                      Sponsor Project
                    </a>
                  </div>
                </div>
              </div>

              {/* Testimonials Section - Cal.com Style */}
              <section className="max-w-7xl mx-auto px-4 sm:px-8 py-24 border-t border-zinc-100 dark:border-zinc-900">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4 tracking-tight">Loved by the Community</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Helping thousands of developers find their first contribution.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Sarah Chen",
                      role: "First-time Contributor",
                      text: "Reposa made my first contribution to Kubernetes so easy. I found a 'good first issue' in seconds that actually matched my skills.",
                      avatar: "SC"
                    },
                    {
                      name: "Marcus Thorne",
                      role: "Maintainer @ Go",
                      text: "As a maintainer, seeing Reposa help new devs find their way into our codebase is incredible. It streamlines the onboarding significantly.",
                      avatar: "MT"
                    },
                    {
                      name: "Elena Rodriguez",
                      role: "Open Source Advocate",
                      text: "The minimalist design and powerful scan technology is exactly what the OS community needed. Brilliant tool for empowerment.",
                      avatar: "ER"
                    }
                  ].map((t, i) => (
                    <div key={i} className="p-8 rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:border-blue-500/20 transition-all flex flex-col justify-between">
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 italic mb-8">"{t.text}"</p>
                      <div className="flex items-center gap-3 border-t border-zinc-50 dark:border-zinc-800/50 pt-6">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-500">{t.avatar}</div>
                        <div className="text-left">
                          <p className="text-sm font-bold">{t.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Feature Grid - Cards */}
              <div id="features" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Card 1 */}
                <div
                  className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group animate-light-wave"
                >
                  <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <FiClock className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Auto-Sorted Issues</h3>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 ease-out">
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      We sort everything by difficulty, type, language, and whether there's a mentor waiting to help you.
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div
                  className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group animate-light-wave"
                >
                  <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <FiTarget className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Color-Coded Labels</h3>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 ease-out">
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      Spot what you need instantly with clear badges showing issue type, skills needed, and project info.
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div
                  className="p-8 text-left sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group animate-light-wave"
                >
                  <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <FiTrendingUp className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">The Full Picture</h3>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 ease-out">
                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      See exactly how many bugs, features, and newbie-friendly issues are up for grabs at a glance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </main >

      {/* Benefits Section */}
      {
        !analysis && !loading && !error && (
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
                  className="p-8 text-center transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <item.icon className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold mb-3 text-lg text-black dark:text-white tracking-tight">{item.title}</h3>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 ease-out">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }

      {/* Use Cases Section */}
      {
        !analysis && !loading && !error && (
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
                className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                  <FiZap className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">First-Time Contributors</h3>
                <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-32 group-hover:opacity-100 ease-out mb-6">
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    Find beginner-friendly issues with clear labels and mentor support. Start your open source journey the right way.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Easy Issues</span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Mentor Support</span>
                </div>
              </div>

              {/* Experienced Developers */}
              <div
                className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                  <FiCode className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Experienced Developers</h3>
                <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-32 group-hover:opacity-100 ease-out mb-6">
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    Skip the noise and jump straight to meaty bugs and features that match your expertise.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Medium Issues</span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Hard Issues</span>
                </div>
              </div>

              {/* Project Maintainers */}
              <div
                className="p-8 text-left transition-all duration-300 hover:scale-[1.02] cursor-default bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-black/5 dark:border-white/10 group"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                  <FiBook className="text-2xl text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-black dark:text-white tracking-tight">Project Maintainers</h3>
                <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-32 group-hover:opacity-100 ease-out mb-6">
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    See how welcoming your repo is to new contributors. Improve your issue labels and onboarding.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">Analytics</span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-700">Insights</span>
                </div>
              </div>
            </div>
          </section>
        )
      }

      {/* Minimalist Footer */}
      <footer className="border-t mt-auto" style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-2">
              <img src="/st1.svg" alt="Reposa" className="w-5 h-5" style={{ filter: theme === 'light' ? 'brightness(0.8)' : 'none' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Built by <a href="https://github.com/neeraj542" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>Neeraj Meena 🌱</a>
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
    </div >
  );
}

export default App;
