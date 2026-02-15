import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IssueCard from './IssueCard';
import type { Issue, Repository } from '../types';

const mockRepo: Repository = {
    id: '1',
    name: 'test-repo',
    owner: 'test-owner',
    full_name: 'test-owner/test-repo',
    description: 'A test repository',
    url: 'https://github.com/test-owner/test-repo',
    stars: 123,
    forks: 45,
    languages: ['TypeScript', 'Go'],
    topics: ['test'],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
};

const mockIssue: Issue = {
    id: 1,
    number: 101,
    title: 'Test issue title',
    body: 'Test issue body',
    url: 'https://github.com/test-owner/test-repo/issues/101',
    state: 'open',
    labels: ['bug', 'help wanted'],
    difficulty: 'easy',
    type: 'bug',
    is_good_first: true,
    has_mentor: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
};

describe('IssueCard', () => {
    it('renders issue and repository information correctly', () => {
        render(<IssueCard issue={mockIssue} repository={mockRepo} />);

        // Check for issue title
        expect(screen.getByText('Test issue title')).toBeInTheDocument();

        // Check for repository name
        expect(screen.getByText('test-repo')).toBeInTheDocument();

        // Check for difficulty badge
        expect(screen.getByText('easy')).toBeInTheDocument();

        // Check for type badge
        expect(screen.getAllByText('bug').length).toBeGreaterThan(0);

        // Check for "Good First Issue" mark
        expect(screen.getByText('✓ First')).toBeInTheDocument();

        // Check for "Mentor" mark
        expect(screen.getByText('👤 Mentor')).toBeInTheDocument();

        // Check for issue number
        expect(screen.getByText(/#101/)).toBeInTheDocument();
    });

    it('displays stars correctly', () => {
        render(<IssueCard issue={mockIssue} repository={mockRepo} />);
        expect(screen.getByText('123')).toBeInTheDocument();
    });
});
