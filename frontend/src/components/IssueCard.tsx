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
            className="issue-card-clotributor"
            style={{
                border: '1px solid #e9ecef',
                borderRadius: '0px',
                background: 'var(--bg-secondary)',
                transition: 'box-shadow 0.2s',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
            <div style={{ display: 'flex', minHeight: '140px' }}>
                {/* Left Sidebar - Project Branding (20%) */}
                <div
                    style={{
                        width: '20%',
                        minWidth: '160px',
                        borderRight: '1px solid #e9ecef',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--bg-tertiary)'
                    }}
                >
                    {/* Project Logo */}
                    <img
                        src={avatarUrl}
                        alt={repository.owner}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-primary)',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                        }}
                    />

                    {/* Project Name */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                marginBottom: '0.25rem',
                                wordBreak: 'break-word'
                            }}
                        >
                            {repository.name}
                        </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
                        {issue.difficulty && (
                            <span
                                style={{
                                    background: 'rgba(50, 108, 229, 0.1)',
                                    color: '#326CE5',
                                    border: '1px solid rgba(50, 108, 229, 0.2)',
                                    padding: '3px 10px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    borderRadius: '0px',
                                    textAlign: 'center'
                                }}
                            >
                                {issue.difficulty}
                            </span>
                        )}
                        {issue.type && (
                            <span
                                style={{
                                    background: 'rgba(20, 184, 166, 0.1)',
                                    color: '#14B8A6',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    padding: '3px 10px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    borderRadius: '0px',
                                    textAlign: 'center'
                                }}
                            >
                                {issue.type}
                            </span>
                        )}
                    </div>

                    {/* Metadata Icons */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', fontSize: '10px', color: 'var(--text-tertiary)', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {issue.is_good_first && (
                            <span title="Good First Issue" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                ✓ First
                            </span>
                        )}
                        {issue.has_mentor && (
                            <span title="Has Mentor" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                👤 Mentor
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Content - Issue Details (80%) */}
                <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                    {/* Top Row - Repo Info */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <a
                                href={repository.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#326CE5'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            >
                                {repository.full_name}
                                <FiExternalLink style={{ fontSize: '10px' }} />
                            </a>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <FiStar style={{ fontSize: '10px' }} />
                                {repository.stars >= 1000 ? `${(repository.stars / 1000).toFixed(1)}k` : repository.stars}
                            </span>
                        </div>

                        {/* Language Labels */}
                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                            {repository.languages.slice(0, 3).map((lang) => (
                                <span
                                    key={lang}
                                    style={{
                                        background: 'rgba(147, 51, 234, 0.1)',
                                        color: '#9333EA',
                                        border: '1px solid rgba(147, 51, 234, 0.2)',
                                        padding: '2px 6px',
                                        fontSize: '9px',
                                        fontWeight: '600',
                                        borderRadius: '0px'
                                    }}
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Middle Row - Issue Title */}
                    <h3 style={{ margin: '0.375rem 0', fontSize: '1rem', fontWeight: '600', lineHeight: '1.3', color: 'var(--text-primary)' }}>
                        <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#326CE5'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                        >
                            {issue.title}
                        </a>
                    </h3>


                    {/* Bottom Row - Metadata */}
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '11px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <FiClock style={{ fontSize: '10px' }} />
                            {formatDate(issue.updated_at)} • #{issue.number}
                        </span>

                        {/* Additional Labels */}
                        {issue.labels.slice(0, 3).map((label, idx) => (
                            <span
                                key={idx}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    color: '#6B7280',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    padding: '2px 6px',
                                    fontSize: '9px',
                                    fontWeight: '600',
                                    borderRadius: '0px',
                                    textTransform: 'uppercase'
                                }}
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

export default IssueCard;
