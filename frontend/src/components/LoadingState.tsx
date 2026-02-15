import React, { useState, useEffect } from 'react';

interface LoadingStateProps {
    repositoryName?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ repositoryName }) => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        'Initializing Neural Analysis Engines...',
        'Parallelizing Repo Map Nodes...',
        'Extracting High-Value Issue Vectors...',
        'Synchronizing with GitHub Cloud Clusters...',
        'Optimizing Beginner-Friendly Results...',
        'Powering up Scan Insights...'
    ];

    const powerMetrics = [
        'GPU Clusters Active: 1.21 GW utilized',
        'Neural Vectorization: 8,421 Issues Indexed',
        'Multi-Cloud Compute Node #42 Distributed',
        'Scanning 10k+ nodes: Deep Parallel Active'
    ];

    useEffect(() => {
        const startTime = Date.now();
        const duration = 2800; // 2.8 seconds to reach 95%, then slow down or wait for API

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / duration) * 100, 98);
            setProgress(percentage);
        }, 30);

        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 1200);

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [messages.length]);

    return (
        <div className="animate-fade-in w-full max-w-2xl mx-auto py-2">
            <div className="flex flex-col gap-4">
                {/* Status Bar */}
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold font-mono">
                    <div className="flex items-center gap-2 text-blue-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>Analysing {repositoryName || 'Repository'}</span>
                    </div>
                    <div className="text-zinc-400 dark:text-zinc-500 flex gap-4">
                        <span className="animate-pulse">{powerMetrics[messageIndex % powerMetrics.length]}</span>
                        <span className="text-blue-500/50">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Deterministic Progress Line with Markers */}
                <div className="space-y-2">
                    <div className="relative w-full h-[6px] bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                        <div
                            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                            style={{ width: `${progress}%` }}
                        />
                        {/* 1s, 2s, 3s markers */}
                        <div className="absolute inset-0 flex justify-between px-[33%] pointer-events-none">
                            <div className="w-[1px] h-full bg-white/20 dark:bg-white/10" />
                            <div className="w-[1px] h-full bg-white/20 dark:bg-white/10" />
                        </div>
                    </div>
                    <div className="flex justify-between px-1 text-[9px] font-mono text-zinc-400 dark:text-zinc-500 font-bold">
                        <span>START</span>
                        <span>1s</span>
                        <span>2s</span>
                        <span>3s</span>
                    </div>
                </div>

                {/* Sub-status */}
                <div className="text-center pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 animate-pulse font-mono">
                        {messages[messageIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;

