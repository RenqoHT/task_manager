'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui';
import { DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Post } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
    post: Post;
    className?: string;
}

export const ChoosePostModal: React.FC<Props> = ({ className, post }) => {
    const router = useRouter();

    return (
        <Dialog open={Boolean(post)} onOpenChange={() => router.back()}> 
        <DialogTrigger>Open</DialogTrigger>
            <DialogContent
                className={cn('w-[265px] max-w-[1000px] min-h-[1000px] bg-white overflow-hidden', className,)}>
                <p>asdfjjjk</p>
            </DialogContent>
        </Dialog>
    );
};
