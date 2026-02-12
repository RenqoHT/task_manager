'use client';

import { Button, Dialog, DialogContent } from '@/components/ui';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React from 'react';
import { PostEditForm } from '../post-edit-form';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    className?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (updatedPost: ExtendedPost) => void;
}

export const PostEditModal: React.FC<Props> = ({ 
    post, 
    className, 
    open, 
    onOpenChange, 
    onSave 
}) => {
    const handleSave = (updatedPost: ExtendedPost) => {
        if (onSave) {
            onSave(updatedPost);
        }
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    'p-0 gap-0 max-w-[1060px] bg-white overflow-y-auto',
                    className,
                )}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-gray-800 break-words">
                        Редактировать пост: {post.post_title || 'Без заголовка'}
                    </DialogTitle>
                </DialogHeader>
                <PostEditForm 
                    post={post} 
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    );
};