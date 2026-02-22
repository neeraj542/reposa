import React, { useState } from 'react';
import { FiSearch, FiFilter, FiExternalLink, FiChevronRight } from 'react-icons/fi';

interface Organization {
    id: string;
    name: string;
    logo: string;
    description: string;
    categories: string[];
    techStack: string[];
    projectsCount: number;
}

const GsocPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('2024');

    // Mock data for demonstration
    const mockOrgs: Organization[] = [
        {
            id: '1',
            name: 'Cloud Native Computing Foundation',
            logo: 'https://raw.githubusercontent.com/cncf/artwork/master/other/cncf/stacked/color/cncf-stacked-color.png',
            description: 'Host for Kubernetes, Prometheus, and many more cloud-native projects.',
            categories: ['Cloud', 'Infrastructure'],
            techStack: ['Go', 'Rust', 'C++'],
            projectsCount: 42
        },
        {
            id: '2',
            name: 'The Linux Foundation',
            logo: 'https://www.linuxfoundation.org/hubfs/LF_logo_color_stacked.svg',
            description: 'The world’s leading home for collaboration on open source software.',
            categories: ['Operating Systems', 'Kernel'],
            techStack: ['C', 'C++', 'Python'],
            projectsCount: 28
        },
        {
            id: '3',
            name: 'Python Software Foundation',
            logo: 'https://www.python.org/static/community_logos/python-logo-master-v3-TM.png',
            description: 'Supporting the development of the Python language and its ecosystem.',
            categories: ['Languages', 'Dev Tools'],
            techStack: ['Python', 'C'],
            projectsCount: 15
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 mt-12">
                <div className="flex-grow">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                        Google Summer of Code
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl">
                        Explore 1000+ organizations participating in GSoC. We index their repositories to find the best entry points for you.
                    </p>
                </div>

                <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50">
                    {['2024', '2023', '2022'].map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${selectedYear === year
                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="relative flex-grow group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by organization or technology..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 focus:border-zinc-900 dark:focus:border-zinc-500 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                    <FiFilter />
                    Filters
                </button>
            </div>

            {/* Grid of Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {mockOrgs.map((org) => (
                    <div
                        key={org.id}
                        className="group flex flex-col p-8 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-zinc-900/10 dark:hover:border-white/10 transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>
                            <button className="p-2 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                <FiExternalLink />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
                            {org.name}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                            {org.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {org.techStack.map((tech) => (
                                <span key={tech} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Projects</span>
                                <span className="text-lg font-extrabold text-zinc-900 dark:text-white leading-none">{org.projectsCount}</span>
                            </div>
                            <div className="flex items-center gap-1 font-bold text-sm text-zinc-900 dark:text-white">
                                View Projects
                                <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty Placeholder */}
                <div className="p-8 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[300px] bg-zinc-50/30 dark:bg-zinc-900/30">
                    <p className="text-zinc-400 font-bold mb-2">More coming soon</p>
                    <p className="text-zinc-400 text-[10px] uppercase tracking-widest text-center">Syncing 1000+ organizations...</p>
                </div>
            </div>
        </div>
    );
};

export default GsocPage;
