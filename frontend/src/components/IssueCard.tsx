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
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all duration-200 overflow-hidden rounded-md"
        >
            <div className="flex flex-col sm:flex-row min-h-[140px]">
                {/* Left Sidebar - Project Branding (20%) */}
                <div
                    className="w-full sm:w-[20%] sm:min-w-[160px] bg-zinc-50 dark:bg-zinc-900/50 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center gap-2"
                >
                    {/* Project Logo */}
                    <img
                        src={avatarUrl}
                        alt={repository.owner}
                        className="w-12 h-12 rounded-lg border border-zinc-200 dark:border-zinc-700 object-cover bg-white dark:bg-zinc-800"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Project Name */}
                    <div className="text-center w-full">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1 break-words">
                            {repository.name}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col gap-1.5 w-full mt-1">
                        {issue.difficulty && (
                            <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-center rounded-[3px]">
                                {issue.difficulty}
                            </span>
                        )}
                        {issue.type && (
                            <span className="bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-center rounded-[3px]">
                                {issue.type}
                            </span>
                        )}
                    </div>

                    {/* Metadata Icons */}
                    <div className="mt-auto flex flex-wrap justify-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                        {issue.is_good_first && (
                            <span title="Good First Issue" className="flex items-center gap-1">
                                ✓ First
                            </span>
                        )}
                        {issue.has_mentor && (
                            <span title="Has Mentor" className="flex items-center gap-1">
                                👤 Mentor
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Content - Issue Details (80%) */}
                <div className="flex-1 p-4 flex flex-col">
                    {/* Top Row - Repo Info */}
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <a
                                href={repository.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                            >
                                {repository.full_name}
                                <FiExternalLink className="text-[10px]" />
                            </a>
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                <FiStar className="text-[10px]" />
                                {repository.stars >= 1000 ? `${(repository.stars / 1000).toFixed(1)}k` : repository.stars}
                            </span>
                        </div>

                        {/* Language Labels */}
                        <div className="flex gap-1.5 flex-wrap">
                            {repository.languages.slice(0, 3).map((lang) => (
                                <span
                                    key={lang}
                                    className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 px-1.5 py-0.5 text-[9px] font-semibold rounded-[3px]"
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Middle Row - Issue Title */}
                    <h3 className="my-1.5 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            {issue.title}
                        </a>
                    </h3>


                    {/* Bottom Row - Metadata */}
                    <div className="mt-auto flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap pt-2">
                        <span className="flex items-center gap-1">
                            <FiClock className="text-[10px]" />
                            {formatDate(issue.updated_at)} • #{issue.number}
                        </span>

                        {/* Additional Labels */}
                        {issue.labels.slice(0, 3).map((label, idx) => (
                            <span
                                key={idx}
                                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded-[3px]"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(IssueCard);
