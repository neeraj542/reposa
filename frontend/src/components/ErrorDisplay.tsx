import React from 'react';
import { FiAlertCircle, FiSearch, FiXOctagon, FiWifi } from 'react-icons/fi';

interface ErrorDisplayProps {
    errorType: 'repo_not_found' | 'no_issues' | 'no_beginner_issues' | 'api_error' | 'network_error' | null;
    message: string;
    onTryAgain?: () => void;
    onGoBack?: () => void;
    onBrowsePopular?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    errorType,
    message,
    onTryAgain,
    onGoBack,
    onBrowsePopular
}) => {
    const getErrorConfig = () => {
        switch (errorType) {
            case 'repo_not_found':
                return {
                    icon: FiXOctagon,
                    title: 'Repository Not Found',
                    suggestions: [
                        'The repository may be private or doesn\'t exist',
                        'Check if the URL is correctly formatted',
                        'Ensure you have access to the repository'
                    ]
                };
            case 'no_issues':
                return {
                    icon: FiAlertCircle,
                    title: 'Issues Section Disabled',
                    suggestions: [
                        'This repository has disabled the issues feature',
                        'Try repositories that actively use GitHub Issues',
                        'Check our popular picks for active projects'
                    ]
                };
            case 'no_beginner_issues':
                return {
                    icon: FiSearch,
                    title: 'No Beginner-Friendly Issues',
                    suggestions: [
                        'This repository doesn\'t have issues marked as beginner-friendly',
                        'Look for repos with "good first issue" labels',
                        'Try our curated popular picks below'
                    ]
                };
            case 'network_error':
                return {
                    icon: FiWifi,
                    title: 'Connection Error',
                    suggestions: [
                        'Check your internet connection',
                        'GitHub API might be temporarily unavailable',
                        'Try again in a few moments'
                    ]
                };
            default:
                return {
                    icon: FiAlertCircle,
                    title: 'Something Went Wrong',
                    suggestions: [
                        'An unexpected error occurred',
                        'Please try again',
                        'If the problem persists, contact support'
                    ]
                };
        }
    };

    const config = getErrorConfig();
    const Icon = config.icon;

    return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
            <div
                className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden animate-fade-in"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
                        <Icon className="text-2xl text-zinc-900 dark:text-zinc-100" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                        {config.title}
                    </h2>

                    {/* Message */}
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Suggestions */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-8 text-left border border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                            Try the following
                        </p>
                        <ul className="space-y-2">
                            {config.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-400 flex-shrink-0" />
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {onTryAgain && (
                            <button
                                onClick={onTryAgain}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                        {onGoBack && (
                            <button
                                onClick={onGoBack}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Go Back
                            </button>
                        )}
                        {onBrowsePopular && errorType === 'no_beginner_issues' && (
                            <button
                                onClick={onBrowsePopular}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                View Popular Picks
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
