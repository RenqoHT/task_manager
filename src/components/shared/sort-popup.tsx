'use client';

import { cn } from '@/lib/utils';
import { ArrowUpDown, Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Check if filter by role is currently active
    const filterByRole = searchParams.get('filterByRole') === 'true';
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleToggleFilter = (enableRoleFilter: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (enableRoleFilter) {
            params.set('filterByRole', 'true');
        } else {
            params.delete('filterByRole');
        }
        
        router.push(`/?${params.toString()}`);
        setIsOpen(false);
    };
    
    return (
        <div ref={dropdownRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors',
                    className,
                )}>
                <ArrowUpDown size={16}/>
                <b>Фильтр:</b>
                <b className="text-primary">{filterByRole ? 'Мои' : 'Все'}</b>
            </div>
            
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div 
                        onClick={() => handleToggleFilter(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                        <span className="text-sm font-medium">Все</span>
                        {!filterByRole && <Check size={16} className="text-primary" />}
                    </div>
                    <div 
                        onClick={() => handleToggleFilter(true)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                        <span className="text-sm font-medium">Мои</span>
                        {filterByRole && <Check size={16} className="text-primary" />}
                    </div>
                </div>
            )}
        </div>
    );
};
