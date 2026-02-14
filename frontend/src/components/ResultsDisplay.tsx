import React, { useState, useMemo } from 'react';
import type { Analysis } from '../types';
import IssueCard from './IssueCard';
import FilterBar from './FilterBar';
import { FiStar, FiGitBranch, FiCode, FiTag, FiCheckCircle, FiAlertCircle, FiFileText, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ResultsDisplayProps {
    analysis: Analysis;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysis }) => {
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
            {/* Repository Header */}
            <div className="glass-card p-6 sm:p-8">
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
                        <p className="text-zinc-400 mb-6 leading-relaxed text-sm sm:text-base">{repository.description}</p>

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
                            <FiCode className="text-zinc-500 text-sm" />
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Languages</span>
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
                            <FiTag className="text-zinc-500 text-sm" />
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {repository.topics.map((topic) => (
                                <span key={topic} className="badge bg-white/5 dark:bg-white/5 light:bg-black/5 text-zinc-400 ring-1 ring-white/10 dark:ring-white/10 light:ring-black/10">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="glass-card p-4 sm:p-5 text-center transition-all" style={{ borderColor: 'var(--border-hover)' }}>
                    <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stats.total_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">Total Issues</div>
                </div>
                <div className="glass-card p-4 sm:p-5 text-center hover:border-emerald-500/20 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">{stats.good_first_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 flex items-center justify-center gap-1 uppercase tracking-wider">
                        <FiCheckCircle className="text-xs hidden sm:inline" />
                        Good First
                    </div>
                </div>
                <div className="glass-card p-4 sm:p-5 text-center hover:border-purple-500/20 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">{stats.help_wanted_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">Help Wanted</div>
                </div>
                <div className="glass-card p-4 sm:p-5 text-center hover:border-red-500/20 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">{stats.bug_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 flex items-center justify-center gap-1 uppercase tracking-wider">
                        <FiAlertCircle className="text-xs hidden sm:inline" />
                        Bugs
                    </div>
                </div>
                <div className="glass-card p-4 sm:p-5 text-center hover:border-blue-500/20 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{stats.feature_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">Features</div>
                </div>
                <div className="glass-card p-4 sm:p-5 text-center hover:border-purple-500/20 transition-all">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">{stats.docs_issues}</div>
                    <div className="text-[10px] sm:text-xs text-zinc-500 flex items-center justify-center gap-1 uppercase tracking-wider">
                        <FiFileText className="text-xs hidden sm:inline" />
                        Docs
                    </div>
                </div>
            </div>

            {/* Sticky Filter Section */}
            <div className="sticky top-[73px] z-40 backdrop-blur-2xl py-4" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                {/* Minimal Filter Section */}
                <div className="mb-6">
                    <FilterBar issues={issues} onFilterChange={setFilteredIssues} />
                </div>
            </div>

            {/* Issues List with Result Count and Per Page Selector */}
            <div>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {searchedIssues.length === issues.length ? (
                            <>
                                Showing <span className="text-blue-400">{startIndex + 1}-{Math.min(endIndex, searchedIssues.length)}</span> of{' '}
                                <span className="text-zinc-500">{issues.length}</span> issues
                            </>
                        ) : (
                            <>
                                Showing <span className="text-blue-400">{startIndex + 1}-{Math.min(endIndex, searchedIssues.length)}</span> of{' '}
                                <span className="text-blue-400">{searchedIssues.length}</span> filtered issues
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
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 border border-white/10 dark:border-white/10 light:border-black/10 hover:border-white/20 dark:hover:border-white/20 light:hover:border-black/20 rounded-full text-xs text-zinc-400 hover:text-white dark:hover:text-white light:hover:text-black transition-all"
                    >
                        <FiRefreshCw className="text-sm" />
                        Reset All
                    </button>
                )}
            </div>

            {searchedIssues.length === 0 ? (
                <div className="glass-card p-12 sm:p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800/50 dark:bg-zinc-800/50 light:bg-zinc-200/50 rounded-2xl flex items-center justify-center">
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
                                className="p-2 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FiChevronLeft className="text-white dark:text-white light:text-black" />
                            </button>

                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                                    disabled={page === '...'}
                                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage
                                        ? 'bg-blue-500 text-white border border-blue-500'
                                        : page === '...'
                                            ? 'cursor-default text-zinc-500'
                                            : 'bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 border border-white/10 dark:border-white/10 light:border-black/10 text-white dark:text-white light:text-black'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <FiChevronRight className="text-white dark:text-white light:text-black" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ResultsDisplay;
