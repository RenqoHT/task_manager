import { cn } from '@/lib/utils';
import { Container } from './container';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui';
import { User } from 'lucide-react';
import { SortPopup } from './sort-popup';
import { Categories } from './categories';
import { SearchInput } from './search-input';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    return (
        <header className={cn('border border-b', className)}>
            <Container className='flex items-center justify-between py-8'>

                {/* Левая часть */}
                <div className='flex items-center gap-4'>
                    <Image src="/logo.png" alt="Logo" width={35} height={32}/>
                    <div>
                        <h1 className='text-2xl uppercase font-black'>TaskMan</h1>
                    </div>
                </div>

                <div className='mx-10 flex-1'>
                    <SearchInput/>
                </div>

                {/* Правая часть */}
                <div className='flex items-center gap-3'>
                    <Button variant='outline' className='flex items-center gap-1'>
                        <User size={16}/>
                        Профиль
                    </Button>
                </div>

            </Container>
        </header>
    );
};