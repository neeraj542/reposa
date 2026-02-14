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
                    background: '#f8f9fa',
                    border: '1px solid #ced4da',
                    borderRadius: '0px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
            >
                {label}
                {selected.length > 0 && (
                    <span style={{
                        background: '#326CE5',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '600',
                        minWidth: '18px',
                        textAlign: 'center'
                    }}>
                        {selected.length}
                    </span>
                )}
                <FiChevronDown
                    style={{
                        marginLeft: 'auto',
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
