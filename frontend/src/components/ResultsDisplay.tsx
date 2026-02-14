import React, { useState, useMemo } from 'react';
import type { Analysis } from '../types';
import IssueCard from './IssueCard';
import FilterBar from './FilterBar';
import { FiStar, FiGitBranch, FiCode, FiTag, FiCheckCircle, FiAlertCircle, FiFileText, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ResultsDisplayProps {
    analysis: Analysis;
    onBack: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysis, onBack }) => {
    const { repository, issues, stats } = analysis;
    const [filteredIssues, setFilteredIssues] = useState(issues);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Apply search filter
    const searchedIssues = useMemo(() => {
        if (!searchQuery.trim()) return filteredIssues;

        const query = searchQuery.toLowerCase();
        return filteredIssues.filter(
            (issue) =>
                issue.title.toLowerCase().includes(query) ||
                issue.body.toLowerCase().includes(query) ||
                issue.labels.some((label) => label.toLowerCase().includes(query))
        );
    }, [filteredIssues, searchQuery]);

    // Pagination calculations
    const totalPages = Math.ceil(searchedIssues.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedIssues = searchedIssues.slice(startIndex, endIndex);

    // Reset to page 1 when filters or search changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchedIssues.length, itemsPerPage]);

    const handleResetFilters = () => {
        setFilteredIssues(issues);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Back Button and Actions */}
            <div className="flex items-center justify-between pb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <FiChevronLeft className="text-lg" />
                    Back to Search
                </button>
            </div>

            {/* Repository Header */}
            <div className="glass-card p-6 sm:p-8 animate-light-wave">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            <a
                                href={repository.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-400 transition-colors"
                            >
                                {repository.full_name}
                            </a>
                        </h2>
                        <p className="mb-6 leading-relaxed text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>{repository.description}</p>

                        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <span className="flex items-center gap-2">
                                <FiStar className="text-yellow-500" />
                                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{repository.stars.toLocaleString()}</span> stars
                            </span>
                            <span className="flex items-center gap-2">
                                <FiGitBranch style={{ color: 'var(--text-tertiary)' }} />
                                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{repository.forks.toLocaleString()}</span> forks
                            </span>
                        </div>
                    </div>
                </div>

                {/* Languages */}
                {repository.languages.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FiCode className="text-sm" style={{ color: 'var(--text-tertiary)' }} />
                            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Languages</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {repository.languages.map((lang) => (
                                <span key={lang} className="badge bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Topics */}
                {repository.topics.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FiTag className="text-sm" style={{ color: 'var(--text-tertiary)' }} />
                            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {repository.topics.map((topic) => (
                                <span key={topic} className="badge bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-white/10">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics Section - Cal.com style */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold mb-1 font-mono tracking-tighter" style={{ color: 'var(--text-primary)' }}>{stats.total_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">Total Issues</div>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-emerald-500/20 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-1 font-mono tracking-tighter">{stats.good_first_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-widest text-center">
                        <FiCheckCircle className="text-xs" />
                        Good First
                    </div>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-violet-500/20 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-violet-500 dark:text-violet-400 mb-1 font-mono tracking-tighter">{stats.help_wanted_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">Help Wanted</div>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-rose-500/20 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-rose-500 dark:text-rose-400 mb-1 font-mono tracking-tighter">{stats.bug_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-widest text-center">
                        <FiAlertCircle className="text-xs" />
                        Bugs
                    </div>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-blue-500/20 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-1 font-mono tracking-tighter">{stats.feature_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center">Features</div>
                </div>
                <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:border-amber-500/20 transition-all flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-amber-500 dark:text-amber-400 mb-1 font-mono tracking-tighter">{stats.docs_issues}</div>
                    <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-widest text-center">
                        <FiFileText className="text-xs" />
                        Docs
                    </div>
                </div>
            </div>

            {/* Optimized Sticky Filter Section */}
            <div className="sticky top-[68px] z-40 py-4 px-2 -mx-2 backdrop-blur-xl bg-gray-50/80 dark:bg-black/60 border-y border-zinc-200/50 dark:border-zinc-800/50">
                <div className="max-w-full overflow-visible">
                    <FilterBar issues={issues} languages={repository.languages} onFilterChange={setFilteredIssues} />
                </div>
            </div>

            {/* Issues List with Result Count and Per Page Selector */}
            <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {searchedIssues.length === issues.length ? (
                            <>
                                Showing <span className="text-blue-600 dark:text-blue-400 font-semibold">{startIndex + 1}-{Math.min(endIndex, searchedIssues.length)}</span> of{' '}
                                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{issues.length}</span> issues
                            </>
                        ) : (
                            <>
                                Showing <span className="text-blue-600 dark:text-blue-400 font-semibold">{startIndex + 1}-{Math.min(endIndex, searchedIssues.length)}</span> of{' '}
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">{searchedIssues.length}</span> filtered issues
                            </>
                        )}
                    </h3>

                    {/* Per Page Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="px-3 py-1.5 border rounded-md text-xs outline-none transition-all"
                            style={{
                                background: 'var(--bg-tertiary)',
                                borderColor: 'var(--border-primary)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {(searchQuery || filteredIssues.length !== issues.length) && (
                    <button
                        onClick={handleResetFilters}
                        className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs transition-all"
                        style={{
                            background: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-secondary)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-secondary)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                            e.currentTarget.style.borderColor = 'var(--border-primary)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <FiRefreshCw className="text-sm" />
                        Reset All
                    </button>
                )}
            </div>

            {searchedIssues.length === 0 ? (
                <div className="glass-card p-12 sm:p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                        <FiSearch className="text-3xl text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 text-base sm:text-lg mb-2">
                        {searchQuery ? 'No issues match your search' : 'No issues found with current filters'}
                    </p>
                    <p className="text-zinc-600 text-sm mb-6">
                        {searchQuery ? 'Try different search terms or clear filters' : 'Try adjusting your filters'}
                    </p>
                    <button
                        onClick={handleResetFilters}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <FiRefreshCw />
                        Reset Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {paginatedIssues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} repository={repository} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderColor: 'var(--border-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <FiChevronLeft style={{ color: 'var(--text-primary)' }} />
                            </button>

                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                                    disabled={page === '...'}
                                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage
                                        ? 'bg-blue-500 text-white border border-blue-500'
                                        : page === '...'
                                            ? 'cursor-default text-zinc-400 dark:text-zinc-500'
                                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-200 dark:border-white/10 border'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                style={{
                                    background: 'var(--bg-tertiary)',
                                    borderColor: 'var(--border-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <FiChevronRight style={{ color: 'var(--text-primary)' }} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ResultsDisplay;
