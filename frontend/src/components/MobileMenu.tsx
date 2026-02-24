import React from 'react';
import { FiX, FiInfo, FiAward, FiPieChart, FiGithub, FiZap } from 'react-icons/fi';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;

    const navItems = [
        { id: 'gsoc', label: 'GSOC', icon: FiAward },
        { id: 'lfx', label: 'LFX', icon: FiZap },
        { id: 'cncf', label: 'CNCF', icon: FiPieChart },
        { id: 'others', label: 'Others', icon: FiInfo },
    ];

    return (
        <div className="fixed inset-0 z-[100] animate-fade-in lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Menu Content */}
            <div
                className="fixed right-0 top-0 h-full w-[280px] shadow-2xl animate-slide-in-right flex flex-col bg-white/95 dark:bg-[#050506]/95 backdrop-blur-2xl border-l border-zinc-200/50 dark:border-white/10"
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-zinc-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <img src="/st1.svg" alt="Reposa" className="w-5 h-5 dark:invert-0 invert" />
                        <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Reposa</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-zinc-100/80 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1.5">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id);
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-bold text-sm tracking-wide transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white active:scale-95"
                        >
                            <item.icon size={18} className="text-[#4285f4]" />
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-5 border-t border-zinc-200/50 dark:border-white/10 mt-5">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Social & Support</p>
                        <a
                            href="https://github.com/neeraj542/reposa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#4285f4] dark:hover:text-[#4285f4] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
                        >
                            <FiGithub size={18} />
                            <span>GitHub</span>
                        </a>
                        <a
                            href="https://github.com/sponsors/neeraj542"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#f58220] dark:hover:text-[#f58220] hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
                        >
                            <FiZap size={18} />
                            <span>Sponsor</span>
                        </a>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-5 border-t border-zinc-200/50 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02]">
                    <button
                        onClick={() => {
                            // This would change view in App.tsx
                            onNavigate('signup');
                            onClose();
                        }}
                        className="w-full py-3.5 rounded-xl font-bold text-[13px] uppercase tracking-widest text-center text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 transition-all active:scale-95 shadow-lg shadow-zinc-900/10 dark:shadow-none"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
