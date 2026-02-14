export interface Repository {
    id: string;
    name: string;
    owner: string;
    full_name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    languages: string[];
    topics: string[];
    created_at: string;
    updated_at: string;
}

export interface Issue {
    id: number;
    number: number;
    title: string;
    body: string;
    url: string;
    state: string;
    labels: string[];
    difficulty?: string;
    type?: string;
    is_good_first: boolean;
    has_mentor: boolean;
    created_at: string;
    updated_at: string;
}

export interface Stats {
    total_issues: number;
    good_first_issues: number;
    help_wanted_issues: number;
    bug_issues: number;
    feature_issues: number;
    docs_issues: number;
}

export interface Analysis {
    id: string;
    repository: Repository;
    issues: Issue[];
    stats: Stats;
    created_at: string;
}
