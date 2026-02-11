'use client';

import { Button, Dialog, DialogContent } from '@/components/ui';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ChoosePostForm } from '../choose-post-form';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    className?: string;
    // onClose?: () => void;
}

export const ChoosePostModal: React.FC<Props> = ({ className, post, /*onClose*/ }) => {
    const router = useRouter();

    // Обработчик закрытия модального окна
    // const handleClose = () => {
    //     if (onClose) {
    //         onClose();
    //     } else {
    //         router.back();
    //     }
    // };

    return (
        <Dialog open={Boolean(post)} onOpenChange={() => router.back()}>
            <DialogContent
                className={cn(
                    'p-0 gap-0 max-w-[1060px] bg-white overflow-y-auto',
                    className,
                )}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-gray-800 break-words">
                        {post.post_title || 'Без заголовка'}
                    </DialogTitle>
                </DialogHeader>
                <ChoosePostForm post={post} />
            </DialogContent>
        </Dialog>
    );
};