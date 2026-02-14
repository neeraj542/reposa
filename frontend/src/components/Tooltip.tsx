import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [show, setShow] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div
                    className={`absolute z-50 px-3 py-2 text-xs rounded-md whitespace-nowrap animate-fade-in ${positionClasses[position]}`}
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--text-secondary)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {content}
                    {/* Arrow */}
                    <div
                        className="absolute w-2 h-2 rotate-45"
                        style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-primary)',
                            ...(position === 'top' && { bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderTop: 'none', borderLeft: 'none' }),
                            ...(position === 'bottom' && { top: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderBottom: 'none', borderRight: 'none' }),
                            ...(position === 'left' && { right: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderTop: 'none', borderRight: 'none' }),
                            ...(position === 'right' && { left: '-5px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderBottom: 'none', borderLeft: 'none' })
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
