import { FiShield, FiLock, FiUser, FiArrowLeft, FiInfo } from 'react-icons/fi';

interface PrivacyPageProps {
    onBack: () => void;
    theme: 'light' | 'dark';
}

const PrivacyPage = ({ onBack, theme }: PrivacyPageProps) => {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-8 max-w-4xl mx-auto animate-fade-in">
            <button
                onClick={onBack}
                className="flex items-center gap-2 mb-12 px-4 py-2 rounded-full transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 group"
                style={{ color: theme === 'dark' ? '#999999' : '#666666' }}
            >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
            </button>

            <div className="mb-16">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
                    Privacy Policy
                </h1>
                <p className="text-xl leading-relaxed" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                    Your trust is our priority. Reposa is built with privacy-first principles to ensure your code and credentials remain secure.
                </p>
            </div>

            <div className="space-y-16">
                {/* Policy Points */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <FiShield className="text-2xl text-zinc-900 dark:text-zinc-100" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Access</h2>
                    </div>
                    <div className="pl-16 space-y-4">
                        <p className="leading-relaxed" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            Reposa exclusively accesses **public repository data** and metadata provided by the GitHub API.
                            We do not, and will never, request access to your private repositories or sensitive codebase.
                        </p>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <FiLock className="text-2xl text-zinc-900 dark:text-zinc-100" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Write Permissions</h2>
                    </div>
                    <div className="pl-16 space-y-4">
                        <p className="leading-relaxed" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            We operate on a strictly **read-only** basis. Reposa does not have the capability to:
                        </p>
                        <ul className="list-disc space-y-2 ml-4" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            <li>Modify your code or files</li>
                            <li>Commit or push changes to your repositories</li>
                            <li>Star, follow, or interact with other users on your behalf</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <FiUser className="text-2xl text-zinc-900 dark:text-zinc-100" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication & Tokens</h2>
                    </div>
                    <div className="pl-16 space-y-4">
                        <p className="leading-relaxed" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            Authentication is **optional**. We only suggest it to:
                        </p>
                        <ul className="list-disc space-y-2 ml-4" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            <li>Increase API rate limits for more comprehensive scans</li>
                            <li>Save your contribution history (if desired)</li>
                        </ul>
                        <p className="mt-4 bg-zinc-50 dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/10 italic text-sm" style={{ color: theme === 'dark' ? '#999999' : '#666666' }}>
                            <FiInfo className="inline mr-2" />
                            Your personal access tokens are never stored in plain text and are used solely for communicating with the GitHub API.
                        </p>
                    </div>
                </section>
            </div>

            <footer className="mt-24 pt-12 border-t border-zinc-100 dark:border-white/10 text-center">
                <p className="text-sm" style={{ color: theme === 'dark' ? '#555555' : '#999999' }}>
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </footer>
        </div>
    );
};

export default PrivacyPage;
