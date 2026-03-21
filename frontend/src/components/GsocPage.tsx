import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiChevronRight } from 'react-icons/fi';

interface Organization {
    id: string;
    name: string;
    logo: string;
    description: string;
    categories: string[];
    techStack: string[];
    projectsCount: number;
    participation: number[];
    ideasUrl: string;
    guideUrl: string;
    exploreUrl: string;
    isFirstTime: boolean;
}

interface ApiOrg {
    name: string;
    url: string;
    image_url: string;
    description: string;
    category: string;
    topics: string[];
    technologies: string[];
    years: {
        [key: string]: {
            num_projects: number;
            projects_url: string;
        }
    };
    ideas_url: string;
    guide_url: string;
}

const GsocPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [showFirstTimeOnly, setShowFirstTimeOnly] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [rawOrgs, setRawOrgs] = useState<ApiOrg[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const orgsPerPage = 6;

    const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                setLoading(true);
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${baseUrl}/api/gsoc/organizations`);
                if (!response.ok) throw new Error('Failed to fetch organizations');
                const data: ApiOrg[] = await response.json();
                setRawOrgs(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchOrgs();
    }, []);

    const allOrgs = useMemo<Organization[]>(() => {
        return rawOrgs
            .filter(org => Object.keys(org.years).includes(selectedYear))
            .map((org) => {
                const participationYears = Object.keys(org.years).map(Number).sort((a, b) => b - a);
                return {
                    id: org.name.toLowerCase().replace(/\s+/g, '-'),
                    name: org.name,
                    logo: org.image_url,
                    description: org.description,
                    categories: [org.category],
                    techStack: [...(org.technologies || []), ...(org.topics || [])].slice(0, 5),
                    projectsCount: org.years[selectedYear]?.num_projects || 0,
                    participation: participationYears,
                    ideasUrl: org.ideas_url || org.url,
                    guideUrl: org.guide_url || org.url,
                    exploreUrl: org.years[selectedYear]?.projects_url || org.url,
                    isFirstTime: participationYears.length > 0 && Math.min(...participationYears) === parseInt(selectedYear)
                };
            });
    }, [rawOrgs, selectedYear]);

    const yearStats = useMemo(() => {
        let totalProjects = 0;
        let newOrgs = 0;
        let repeatingOrgs = 0;

        allOrgs.forEach(org => {
            totalProjects += org.projectsCount;
            if (org.isFirstTime) {
                newOrgs++;
            } else {
                repeatingOrgs++;
            }
        });

        return {
            totalOrgs: allOrgs.length,
            totalProjects,
            newOrgs,
            repeatingOrgs
        };
    }, [allOrgs]);

    const categoriesList = useMemo(() => {
        const categories = new Set(['All']);
        allOrgs.forEach(org => org.categories.forEach(cat => {
            if (cat) categories.add(cat);
        }));
        return Array.from(categories).sort();
    }, [allOrgs]);

    const filteredOrgs = useMemo(() => {
        return allOrgs.filter(org => {
            const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFirstTime = showFirstTimeOnly ? org.isFirstTime : true;
            const matchesCategory = selectedCategory === 'All' ? true : org.categories.includes(selectedCategory);

            return matchesSearch && matchesFirstTime && matchesCategory;
        });
    }, [allOrgs, searchQuery, showFirstTimeOnly, selectedCategory, selectedYear]);

    const indexOfLastOrg = currentPage * orgsPerPage;
    const indexOfFirstOrg = indexOfLastOrg - orgsPerPage;
    const currentOrgs = filteredOrgs.slice(indexOfFirstOrg, indexOfLastOrg);
    const totalPages = Math.ceil(filteredOrgs.length / orgsPerPage);

    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', current - 1, current, current + 1, '...', total];
    };
    const visiblePages = getVisiblePages(currentPage, totalPages);

    const scrollToResults = () => {
        setTimeout(() => {
            const resultsTop = document.getElementById('results-top');
            if (resultsTop) {
                const y = resultsTop.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 50);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-[#4285f4] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Loading Ecosystem...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl font-black italic">!</div>
                <h3 className="text-white text-xl font-black uppercase tracking-tighter mb-2">Sync Failed</h3>
                <p className="text-zinc-500 text-sm max-w-xs">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-3 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/5 font-black text-[10px] uppercase tracking-widest hover:border-red-500 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 sm:px-0">
            {/* GSoC Hero Section */}
            <div className="relative group p-5 sm:p-12 md:p-20 rounded-[24px] md:rounded-[48px] overflow-hidden mb-6 sm:mb-16 mt-4 sm:mt-12 bg-[#050506] mx-2 sm:mx-0">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#4285f4]/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                            <span className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-[#f58220] text-white text-[10px] md:text-xs font-bold md:font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                GSoC {selectedYear}
                            </span>
                            <div className="h-px w-8 md:w-12 bg-white/10" />
                            <span className="text-zinc-500 text-[10px] md:text-xs font-semibold md:font-bold uppercase tracking-widest">
                                Google Summer of Code
                            </span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold md:font-black tracking-tight text-white mb-4 sm:mb-8 uppercase leading-[1.1] sm:leading-[0.85] break-words">
                            Ecosystem <br className="hidden sm:block" /> Results
                        </h2>
                        <p className="text-zinc-400 text-sm sm:text-xl max-w-xl font-normal sm:font-medium leading-relaxed mb-6 sm:mb-8">
                            Navigate through {selectedYear} selected organizations. We index their repositories to help you find the perfect entry point.
                        </p>

                        {/* Stats Banner */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl">
                            {[
                                { label: 'Organizations', value: yearStats.totalOrgs, color: 'text-white' },
                                { label: 'Total Projects', value: yearStats.totalProjects, color: 'text-[#4285f4]' },
                                { label: 'New Orgs', value: yearStats.newOrgs, color: 'text-[#f58220]' },
                                { label: 'Repeating', value: yearStats.repeatingOrgs, color: 'text-emerald-400' }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-3 sm:p-4 rounded-[16px] sm:rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 hover:scale-[1.02]">
                                    <span className={`text-2xl sm:text-3xl font-extrabold sm:font-black tracking-tight mb-1 ${stat.color}`}>
                                        {stat.value}
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] font-semibold sm:font-bold text-zinc-500 uppercase tracking-wider leading-tight">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Year Selector */}
                        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl w-fit">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    onClick={() => {
                                        setSelectedYear(year);
                                        setCurrentPage(1);
                                        scrollToResults();
                                    }}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.15em] transition-all duration-300 ${selectedYear === year
                                        ? 'bg-[#4285f4] text-white shadow-lg shadow-blue-500/20'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto flex justify-center">
                        <div className="relative p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] bg-gradient-to-br from-[#4285f4] to-[#1a73e8] shadow-2xl shadow-blue-500/20 flex flex-col items-center text-center w-full max-w-[240px] sm:max-w-[320px] mx-auto overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-28 sm:w-40 h-28 sm:h-40 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative mb-4 sm:mb-6">
                                <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-md rounded-[14px] sm:rounded-2xl border border-white/20">
                                    <img src="https://www.gstatic.com/images/branding/product/2x/gsoc_64dp.png" alt="GSoC Logo" className="w-12 h-12 sm:w-16 sm:h-16 invert brightness-0" />
                                </div>
                            </div>
                            <h3 className="text-white text-xl sm:text-2xl font-bold sm:font-black uppercase tracking-tight sm:tracking-tighter mb-1 sm:mb-2 italic">GSoC {selectedYear}</h3>
                            <p className="text-white/80 text-[8px] sm:text-[10px] font-semibold sm:font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">Open Source Hub</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar - Optimized */}
            <div id="results-top" className="relative max-w-2xl mx-auto -mt-3 sm:-mt-24 mb-8 sm:mb-16 z-20 px-4 sm:px-0">
                <div className="relative group">
                    <FiSearch className="absolute left-8 sm:left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#4285f4] transition-colors text-lg sm:text-xl" />
                    <input
                        type="text"
                        placeholder="Search organizations or tech stacks..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-white text-[#050506] dark:bg-[#050506] dark:text-white pl-12 sm:pl-16 pr-5 sm:pr-8 py-3.5 sm:py-6 rounded-[20px] sm:rounded-[32px] text-sm sm:text-lg font-semibold sm:font-bold tracking-wide sm:tracking-widest placeholder:text-zinc-400 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-[#4285f4]/30 transition-all shadow-xl shadow-black/5 dark:shadow-black/20 border border-zinc-100 dark:border-white/5"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Year and Filters Sidebar/TopBar */}
                <aside className="shrink-0 w-full md:w-56 lg:w-64 flex flex-col gap-5 sm:gap-6 md:sticky md:top-24 md:h-[calc(100vh-8rem)]">
                    {/* Contributor Focus */}
                    <div className="p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Contributor Focus</h4>
                        </div>
                        <button
                            onClick={() => {
                                setShowFirstTimeOnly(!showFirstTimeOnly);
                                setCurrentPage(1);
                                scrollToResults();
                            }}
                            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${showFirstTimeOnly
                                ? 'bg-[#f58220] text-white shadow-lg shadow-orange-500/20'
                                : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-100 dark:border-white/5'
                                }`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">First-time Orgs</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${showFirstTimeOnly ? 'bg-white/30' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${showFirstTimeOnly ? 'left-5' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>

                    {/* Categories List */}
                    <div className="p-6 rounded-[32px] bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 px-2">Categories</h4>
                        <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 overflow-x-auto pb-2 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {categoriesList.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentPage(1);
                                        scrollToResults();
                                    }}
                                    className={`shrink-0 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                        ? 'bg-[#4285f4] text-white shadow-lg shadow-blue-500/10'
                                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="flex-grow min-h-[800px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 px-2 sm:px-0">
                        {currentOrgs.map((org) => (
                            <div
                                key={org.id}
                                className="group p-4 sm:p-6 rounded-[20px] sm:rounded-[32px] flex flex-col gap-4 sm:gap-5 bg-white dark:bg-[#0a0a0b] border border-zinc-100 dark:border-white/5 hover:border-[#4285f4]/30 hover:shadow-[0_4px_24px_rgba(66,133,244,0.08)] dark:hover:shadow-[0_4px_24px_rgba(66,133,244,0.08)] transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Background subtle glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4285f4]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {org.isFirstTime && (
                                    <div className="absolute top-0 right-0 z-10">
                                        <div className="bg-gradient-to-r from-[#f58220] to-[#db4437] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-lg shadow-orange-500/20">
                                            New Org
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="w-14 h-14 rounded-[20px] bg-white border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                    </div>
                                    <div className="flex flex-col items-end pt-1">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter">{org.projectsCount}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-[#4285f4] uppercase tracking-widest leading-none mt-1">Projects</span>
                                    </div>
                                </div>

                                <div className="relative z-10 -mt-2">
                                    <h3 className="text-lg sm:text-xl font-bold sm:font-black text-zinc-900 dark:text-white line-clamp-1 mb-1.5 sm:mb-2 group-hover:text-[#4285f4] transition-colors tracking-tight">
                                        {org.name}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-[11px] sm:text-sm line-clamp-2 leading-relaxed h-[36px] sm:h-[40px]">
                                        {org.description}
                                    </p>
                                </div>

                                {/* Participation Timeline */}
                                <div className="flex flex-col gap-2.5 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0f9d58]" /> History
                                        </span>
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{org.participation.length} Years Active</span>
                                    </div>
                                    <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 p-0.5">
                                        {years.slice().reverse().map(year => {
                                            const participated = org.participation.includes(parseInt(year));
                                            return (
                                                <div
                                                    key={year}
                                                    title={`Participated in ${year}`}
                                                    className={`flex-grow rounded-full transition-all duration-500 ${participated
                                                        ? 'bg-gradient-to-r from-[#4285f4] to-[#1a73e8] scale-y-100 opacity-100'
                                                        : 'bg-transparent scale-y-50 opacity-20'
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 relative z-10">
                                    {org.techStack.map((tech) => (
                                        <span key={tech} className="px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-200/50 dark:bg-white/5 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:border-[#4285f4]/30 group-hover:text-zinc-900 dark:group-hover:text-white transition-all">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 sm:pt-6 border-t border-zinc-100 dark:border-white/5 grid grid-cols-2 gap-2 sm:gap-3 relative z-10 flex-grow content-end">
                                    <a
                                        href={org.ideasUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider sm:tracking-widest hover:bg-[#4285f4] dark:hover:bg-[#4285f4] dark:hover:text-white transition-all shadow-sm min-w-0"
                                    >
                                        <span className="truncate">Ideas List</span>
                                    </a>
                                    <a
                                        href={org.guideUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white dark:bg-[#0a0a0b] text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 text-[9px] sm:text-[10px] font-bold sm:font-black uppercase tracking-wider sm:tracking-widest hover:border-zinc-400 dark:hover:border-white/30 transition-all min-w-0"
                                    >
                                        <span className="truncate">Org Guide</span>
                                    </a>
                                </div>

                                <div className="flex items-center justify-between mt-1 relative z-10">
                                    <div className="flex gap-1.5">
                                        {org.categories.slice(0, 2).map(cat => (
                                            <span key={cat} className="text-[9px] font-black text-[#f58220] uppercase tracking-widest bg-[#f58220]/10 px-2 py-1 rounded-md">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={org.exploreUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-black text-[#4285f4] uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all bg-[#4285f4]/10 hover:bg-[#4285f4]/20 px-3 py-1.5 rounded-lg"
                                    >
                                        Explore Org
                                        <FiChevronRight className="text-sm" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 pb-12 px-2">
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
                                    scrollToResults();
                                }}
                                disabled={currentPage === 1}
                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/5 font-black text-[9px] sm:text-[10px] uppercase tracking-widest disabled:opacity-50 hover:border-[#4285f4] transition-all"
                            >
                                Prev
                            </button>
                            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                                {visiblePages.map((page, idx) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-500 font-bold">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => {
                                                setCurrentPage(page as number);
                                                scrollToResults();
                                            }}
                                            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs transition-all ${currentPage === page
                                                ? 'bg-[#4285f4] text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 text-zinc-500 hover:text-[#4285f4] hover:bg-zinc-50 dark:hover:bg-white/5'}`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                    scrollToResults();
                                }}
                                disabled={currentPage === totalPages}
                                className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-white/5 font-black text-[9px] sm:text-[10px] uppercase tracking-widest disabled:opacity-50 hover:border-[#4285f4] transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GsocPage;
