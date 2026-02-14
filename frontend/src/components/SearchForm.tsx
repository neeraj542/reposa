import React, { useState } from 'react';
import { FiSearch, FiArrowRight } from 'react-icons/fi';

interface SearchFormProps {
    onSearch: (url: string) => void;
    loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
    const [repoUrl, setRepoUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (repoUrl.trim()) {
            onSearch(repoUrl.trim());
        }
    };

    const handleExampleClick = (repo: string) => {
        setRepoUrl(`https://github.com/${repo}`);
        setTimeout(() => {
            onSearch(`https://github.com/${repo}`);
        }, 100);
    };

    const exampleRepos = [
        { name: 'kubernetes/kubernetes', desc: 'Container orchestration', owner: 'kubernetes' },
        { name: 'golang/go', desc: 'Go programming language', owner: 'golang' },
        { name: 'prometheus/prometheus', desc: 'Monitoring system', owner: 'prometheus' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 relative">
                            <FiSearch
                                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-lg text-gray-400"
                            />
                            <input
                                type="text"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="https://github.com/owner/repo"
                                className="w-full pl-14 pr-5 py-5 rounded-xl text-base transition-all duration-300 focus:ring-2 focus:ring-black/5 outline-none font-medium placeholder:text-gray-400"
                                style={{
                                    background: '#F3F4F6', // bg-gray-100
                                    color: '#000000',
                                    border: '1px solid transparent'
                                }}
                                disabled={loading}
                                autoFocus
                            />
                            {repoUrl && !loading && (
                                <button
                                    type="button"
                                    onClick={() => setRepoUrl('')}
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !repoUrl.trim()}
                            className="px-8 py-5 rounded-xl font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                            style={{
                                background: loading || !repoUrl.trim() ? '#E5E7EB' : '#F3F4F6',
                                color: loading || !repoUrl.trim() ? '#9CA3AF' : '#000000',
                                border: '1px solid transparent'
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="hidden sm:inline">Digging...</span>
                                </>
                            ) : (
                                <>
                                    <span>Analyze</span>
                                    <FiArrowRight className="text-gray-400" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Examples Section - Clean & Minimal */}
            <div className="border-t pt-8 border-gray-100 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wider mb-6 text-gray-500 dark:text-gray-400 text-left">
                    Popular picks
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {exampleRepos.map((repo) => (
                        <button
                            key={repo.name}
                            onClick={() => handleExampleClick(repo.name)}
                            className="group p-4 rounded-xl text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                            disabled={loading}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https://avatars.githubusercontent.com/${repo.owner}?size=40`}
                                    alt={repo.owner}
                                    className="w-10 h-10 rounded-lg bg-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                                        {repo.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {repo.desc}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Keyboard Hint */}
            <div className="mt-6 text-center">
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Press <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>Enter</kbd> to analyze
                </p>
            </div>
        </div>
    );
};

export default SearchForm;
