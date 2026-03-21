import React from 'react';
import type { Issue, Repository } from '../types';
import { FiExternalLink, FiStar, FiClock, FiChevronRight } from 'react-icons/fi';

interface IssueCardProps {
    issue: Issue;
    repository: Repository;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, repository }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // GitHub avatar URL
    const avatarUrl = `https://avatars.githubusercontent.com/${repository.owner}?size=80`;

    return (
        <div
            className="group glass-card overflow-hidden rounded-[32px] sm:rounded-[40px] transform-gpu hover:ring-2 hover:ring-blue-500/20"
        >
            <div className="flex flex-col sm:flex-row min-h-[220px]">
                {/* Left Side: Project Metadata (25%) */}
                <div className="w-full sm:w-[280px] p-6 sm:p-8 bg-zinc-50/50 dark:bg-white/[0.02] border-b sm:border-b-0 sm:border-r border-zinc-200/50 dark:border-white/5 flex flex-col items-center sm:items-start text-center sm:text-left gap-6">
                    <img
                        src={avatarUrl}
                        alt={repository.owner}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl shadow-2xl shadow-zinc-900/10 dark:shadow-none border-2 border-white dark:border-zinc-800 object-cover bg-white dark:bg-zinc-900 transition-transform group-hover:scale-105 duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <div className="space-y-2 w-full">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
                                Project
                            </span>
                            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 truncate">
                                {repository.name}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-wider">
                                CNCF
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-zinc-200/50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider border border-zinc-300/50 dark:border-white/10">
                                Sandbox
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Issue Details (75%) */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                    <div>
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                                <a
                                    href={repository.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-2"
                                >
                                    {repository.full_name}
                                    <FiExternalLink className="text-[10px]" />
                                </a>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <FiStar className="text-yellow-500 text-xs" />
                                <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                                    {repository.stars >= 1000 ? `${(repository.stars / 1000).toFixed(1)}k` : repository.stars}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            <a
                                href={issue.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {issue.title}
                            </a>
                        </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Difficulty & Type */}
                        <div className="flex flex-wrap gap-2">
                            {issue.difficulty && (
                                <span className="badge badge-easy">
                                    {issue.difficulty}
                                </span>
                            )}
                            {issue.is_good_first && (
                                <span className="badge bg-violet-500/15 text-violet-500 border border-violet-500/20">
                                    Good First
                                </span>
                            )}
                            {issue.type && (
                                <span className={`badge ${issue.type.toLowerCase() === 'bug' ? 'badge-bug' : 'badge-feature'}`}>
                                    {issue.type}
                                </span>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-2">
                            {repository.languages.slice(0, 3).map((lang) => (
                                <span
                                    key={lang}
                                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider border border-transparent dark:border-white/5"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-white/5">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
                            <span className="flex items-center gap-2">
                                <FiClock className="text-xs" />
                                {formatDate(issue.updated_at)}
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-800">•</span>
                            <span>Issue #{issue.number}</span>
                        </div>
                        <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                        >
                            Open Issue
                            <FiChevronRight className="text-sm" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(IssueCard);
