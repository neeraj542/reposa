import React, { useState } from 'react';
import type { Issue } from '../types';
import { FiFilter, FiX } from 'react-icons/fi';
import FilterDropdown from './FilterDropdown';

interface FilterBarProps {
    issues: Issue[];
    languages: string[];
    onFilterChange: (filtered: Issue[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ issues, languages: availableLanguages, onFilterChange }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string[]>([]);
    const [selectedSpecial, setSelectedSpecial] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const difficulties = ['easy', 'medium', 'hard'];
    const types = ['bug', 'feature', 'docs', 'enhancement'];
    const specialOptions = ['good first', 'has mentor'];

    const applyFilters = (
        diff: string[],
        type: string[],
        special: string[],
        languages: string[]
    ) => {
        let filtered = [...issues];

        if (diff.length > 0) {
            filtered = filtered.filter((issue) => diff.includes(issue.difficulty || ''));
        }

        if (type.length > 0) {
            filtered = filtered.filter((issue) => type.includes(issue.type || ''));
        }

        if (special.includes('good first')) {
            filtered = filtered.filter((issue) => issue.is_good_first);
        }

        if (special.includes('has mentor')) {
            filtered = filtered.filter((issue) => issue.has_mentor);
        }

        if (languages.length > 0) {
            filtered = filtered.filter((issue) => {
                const repository = (issue as Issue & { repository?: { languages: string[] } }).repository;
                if (repository && repository.languages) {
                    return repository.languages.some((lang: string) => languages.includes(lang));
                }
                return false;
            });
        }

        onFilterChange(filtered);
    };

    const handleDifficultyChange = (selected: string[]) => {
        setSelectedDifficulty(selected);
        applyFilters(selected, selectedType, selectedSpecial, selectedLanguages);
    };

    const handleTypeChange = (selected: string[]) => {
        setSelectedType(selected);
        applyFilters(selectedDifficulty, selected, selectedSpecial, selectedLanguages);
    };

    const handleSpecialChange = (selected: string[]) => {
        setSelectedSpecial(selected);
        applyFilters(selectedDifficulty, selectedType, selected, selectedLanguages);
    };

    const handleLanguageChange = (selected: string[]) => {
        setSelectedLanguages(selected);
        applyFilters(selectedDifficulty, selectedType, selectedSpecial, selected);
    };

    const clearFilters = () => {
        setSelectedDifficulty([]);
        setSelectedType([]);
        setSelectedSpecial([]);
        setSelectedLanguages([]);
        onFilterChange(issues);
    };

    const hasActiveFilters =
        selectedDifficulty.length > 0 ||
        selectedType.length > 0 ||
        selectedSpecial.length > 0 ||
        selectedLanguages.length > 0;

    return (
        <div className="flex flex-col gap-3">
            {/* Filter Dropdowns & Clear Controls */}
            {/* Filter Dropdowns & Clear Controls */}
            <div className="flex items-center gap-2 sm:gap-3 pb-1 sm:pb-0">
                <div className="flex items-center gap-2 mr-1 sm:mr-2 flex-shrink-0">
                    <FiFilter className="text-[10px] text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Filters
                    </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
                    <FilterDropdown
                        label="Difficulty"
                        options={difficulties}
                        selected={selectedDifficulty}
                        onChange={handleDifficultyChange}
                    />
                    <FilterDropdown
                        label="Type"
                        options={types}
                        selected={selectedType}
                        onChange={handleTypeChange}
                    />
                    <FilterDropdown
                        label="Language"
                        options={availableLanguages}
                        selected={selectedLanguages}
                        onChange={handleLanguageChange}
                    />
                    <FilterDropdown
                        label="Special"
                        options={specialOptions}
                        selected={selectedSpecial}
                        onChange={handleSpecialChange}
                    />
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="ml-2 sm:ml-auto text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1 pl-2 sm:pl-4 flex-shrink-0"
                    >
                        <FiX className="text-xs" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
