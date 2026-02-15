import React from 'react';
import { FiX, FiInfo, FiAward, FiPieChart, FiGithub, FiZap } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate }) => {
    const { theme } = useTheme();

    if (!isOpen) return null;

    const navItems = [
        { id: 'features', label: 'Features', icon: FiInfo },
        { id: 'benefits', label: 'Why Reposa', icon: FiAward },
        { id: 'use-cases', label: 'Use Cases', icon: FiPieChart },
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
                className="fixed right-0 top-0 h-full w-[280px] shadow-2xl animate-slide-in-right flex flex-col"
                style={{
                    background: theme === 'dark' ? '#111111' : '#ffffff',
                    borderLeft: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                }}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center gap-2">
                        <img src="/st1.svg" alt="Reposa" className="w-6 h-6" style={{ filter: theme === 'light' ? 'brightness(0.8)' : 'none' }} />
                        <span className="font-bold text-lg" style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>Reposa</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id);
                                onClose();
                            }}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left font-semibold transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95"
                            style={{ color: theme === 'dark' ? '#999999' : '#666666' }}
                        >
                            <item.icon size={20} className="text-blue-500" />
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <div className="pt-6 border-t mt-6" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Social & Support</p>
                        <a
                            href="https://github.com/neeraj542/reposa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-zinc-500 hover:text-blue-500 transition-colors"
                        >
                            <FiGithub size={18} />
                            <span>GitHub</span>
                        </a>
                        <a
                            href="https://github.com/sponsors/neeraj542"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-zinc-500 hover:text-rose-500 transition-colors"
                        >
                            <FiZap size={18} />
                            <span>Sponsor</span>
                        </a>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                    <button
                        onClick={() => {
                            // This would change view in App.tsx
                            onNavigate('signup');
                            onClose();
                        }}
                        className="w-full py-4 rounded-xl font-bold text-center text-white bg-black dark:bg-zinc-100 dark:text-black transition-all active:scale-95 shadow-lg"
                    >
                        Get Started Free
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
