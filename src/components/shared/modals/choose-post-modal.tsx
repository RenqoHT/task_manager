'use client';

import { Button, Dialog, DialogContent } from '@/components/ui';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ChoosePostForm } from '../choose-post-form';
import { PostEditModal } from './post-edit-modal';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [postForEdit, setPostForEdit] = useState<ExtendedPost | null>(null);

    // Обработчик закрытия модального окна
    // const handleClose = () => {
    //     if (onClose) {
    //         onClose();
    //     } else {
    //         router.back();
    //     }
    // };

    // Обработчик события открытия модалки редактирования
    useEffect(() => {
        const handleOpenEditModal = (event: Event) => {
            const customEvent = event as CustomEvent<ExtendedPost>;
            setPostForEdit(customEvent.detail);
            setShowEditModal(true);
        };

        window.addEventListener('openEditPostModal', handleOpenEditModal);

        return () => {
            window.removeEventListener('openEditPostModal', handleOpenEditModal);
        };
    }, []);

    // Обработчик сохранения изменений
    const handleSave = (updatedPost: ExtendedPost) => {
        // Можно обновить состояние поста в родительском компоненте
        // или обновить страницу для отражения изменений
        router.refresh(); // Обновляем страницу для отображения изменений
    };

    return (
        <>
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

            {postForEdit && (
                <PostEditModal
                    post={postForEdit}
                    open={showEditModal}
                    onOpenChange={setShowEditModal}
                    onSave={handleSave}
                />
            )}
        </>
    );
};