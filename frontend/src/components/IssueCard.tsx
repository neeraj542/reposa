import React from 'react';
import type { Issue, Repository } from '../types';
import { FiExternalLink, FiStar, FiClock } from 'react-icons/fi';

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
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden rounded-2xl sm:rounded-xl"
        >
            <div className="flex flex-col p-4 sm:p-5">
                {/* Row 1: Project & Repo Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Project Logo - Consistent Size */}
                        <img
                            src={avatarUrl}
                            alt={repository.owner}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 object-cover bg-white dark:bg-zinc-800 shrink-0"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate">
                                {repository.owner}
                            </span>
                            <a
                                href={repository.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-500 transition-colors truncate"
                            >
                                {repository.name}
                            </a>
                        </div>
                    </div>

                    {/* Repository Popularity - Compact */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-zinc-800 rounded-full">
                        <FiStar className="text-yellow-500 text-[10px] sm:text-xs" />
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            {repository.stars >= 1000 ? `${(repository.stars / 1000).toFixed(1)}k` : repository.stars}
                        </span>
                    </div>
                </div>

                {/* Row 2: Issue Title - Major Focal Point */}
                <h3 className="mb-4 text-base sm:text-lg font-bold leading-tight sm:leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                    <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block decoration-2 underline-offset-4 group-hover:underline"
                    >
                        {issue.title}
                    </a>
                </h3>

                {/* Row 3: Badges & Languages - Flowing Flex */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {/* Primary Issue Badges */}
                    {issue.difficulty && (
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wide">
                            {issue.difficulty}
                        </span>
                    )}
                    {issue.type && (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wide">
                            {issue.type}
                        </span>
                    )}
                    {issue.is_good_first && (
                        <span className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wide flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                            First Issue
                        </span>
                    )}

                    {/* Separator for Languages (Hidden on mobile if stack is deep) */}
                    <div className="hidden sm:block w-[1px] h-3 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                    {/* Language Badges */}
                    {repository.languages.slice(0, 2).map((lang) => (
                        <span
                            key={lang}
                            className="bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 border border-transparent dark:border-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wide"
                        >
                            {lang}
                        </span>
                    ))}
                </div>

                {/* Row 4: Freshness & Metadata Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                        <span className="flex items-center gap-1.5">
                            <FiClock className="text-zinc-400" />
                            {formatDate(issue.updated_at)}
                        </span>
                        <span className="text-zinc-200 dark:text-zinc-800">•</span>
                        <span>#{issue.number}</span>
                    </div>

                    <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] sm:text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all group-hover:bg-blue-500/10 sm:group-hover:bg-transparent px-2 py-1 rounded-md sm:px-0"
                    >
                        View on GitHub
                        <FiExternalLink />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default React.memo(IssueCard);
