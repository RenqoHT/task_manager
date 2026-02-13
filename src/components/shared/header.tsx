'use client';

import { cn } from '@/lib/utils';
import { Container } from './container';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '../ui';
import { User } from 'lucide-react';
import { SortPopup } from './sort-popup';
import { Categories } from './categories';
import { SearchInput } from './search-input';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AuthModal } from './modals';

interface Props {
    className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ redirect: false });
    };

    return (
        <header className={cn('border border-b', className)}>
            <Container className='flex items-center justify-between py-8'>

                {/* Левая часть */}
                <Link href={'/'} >
                    <div className='flex items-center gap-4'>
                        <Image src="/logo.png" alt="Logo" width={35} height={32}/>
                        <div>
                            <h1 className='text-2xl uppercase font-black'>TaskMan</h1>
                        </div>
                    </div>
                </Link>
                <div className='mx-10 flex-1'>
                    <SearchInput/>
                </div>

                {/* Правая часть */}
                <div className='flex items-center gap-3'>
                    {session ? (
                        <>
                            <span className="text-sm font-medium">Привет, {session.user?.name}!</span>
                            <Button
                                variant='outline'
                                className='flex items-center gap-1'
                                onClick={handleLogout}
                            >
                                <User size={16}/>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant='outline'
                            className='flex items-center gap-1'
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            <User size={16}/>
                            Профиль
                        </Button>
                    )}
                </div>

            </Container>
            
            {isAuthModalOpen && (
                <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={() => setIsAuthModalOpen(false)} 
                />
            )}
        </header>
    );
};