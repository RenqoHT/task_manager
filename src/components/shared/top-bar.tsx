import React, { Suspense } from 'react';
import { Container } from './container';
import { Categories } from './categories';
import { SortPopup } from './sort-popup';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export const TopBar: React.FC<Props> = ({ className }) => {
    return (
        <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
            <Container className="flex items-center justify-between ">
                <Categories/>
                <Suspense fallback={<div className="h-[52px] w-32 bg-gray-50 rounded-2xl animate-pulse" />}>
                    <SortPopup/>
                </Suspense>
            </Container>
        </div>
    );
};
