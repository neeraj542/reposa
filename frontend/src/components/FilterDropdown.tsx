import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface FilterDropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="filter-dropdown" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="dropdown-button"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    zIndex: isOpen ? 1002 : 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
            >
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">{label}:</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                    {selected.length === 0 ? 'All' : selected.length === 1 ? selected[0] : `${selected.length} selected`}
                </span>
                <FiChevronDown
                    className="text-zinc-400"
                    style={{
                        marginLeft: '4px',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                />
            </button>

            {isOpen && (
                <div
                    className="dropdown-menu"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        minWidth: '200px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        marginTop: '4px'
                    }}
                >
                    {options.map(option => (
                        <label
                            key={option}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                                color: 'var(--text-primary)',
                                fontSize: '13px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => toggleOption(option)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                    accentColor: '#326CE5'
                                }}
                            />
                            <span className="capitalize">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
