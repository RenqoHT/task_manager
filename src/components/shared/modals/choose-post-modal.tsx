'use client';

import { Button, Dialog, DialogContent } from '@/components/ui';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { ChoosePostForm } from '../choose-post-form';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    canDelete?: boolean;
    onClose?: () => void;
    className?: string;
}

export const ChoosePostModal: React.FC<Props> = ({ className, post, canDelete, onClose }) => {
    const handleOpenChange = (open: boolean) => {
        if (!open && onClose) {
            onClose();
        }
    };

    return (
        <>
            <Dialog open={Boolean(post)} onOpenChange={handleOpenChange}>
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
                    <ChoosePostForm post={post} canDelete={canDelete} />
                </DialogContent>
            </Dialog>
        </>
    );
};
