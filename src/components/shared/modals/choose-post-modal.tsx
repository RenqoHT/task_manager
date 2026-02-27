'use client';

import { Dialog, DialogContent } from '@/components/ui';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ChoosePostForm } from '../choose-post-form';
import { PostEditModal } from './index';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    onClose?: () => void;
    className?: string;
}

export const ChoosePostModal: React.FC<Props> = ({ className, post, onClose }) => {
    const router = useRouter();

    // ── Состояние модалки редактирования ────────────────────
    const [showEditModal, setShowEditModal] = useState(false);
    const [postForEdit, setPostForEdit] = useState<ExtendedPost | null>(null);

    // Флаг: показывать ли choose-модалку
    // Скрываем, когда открыта модалка редактирования
    const isChooseOpen = Boolean(post) && !showEditModal;

    const handleOpenChange = (open: boolean) => {
        if (!open && onClose) {
            onClose();
        }
    };

    // Колбэк из ChoosePostForm — «хочу редактировать»
    const handleEdit = (p: ExtendedPost) => {
        setPostForEdit(p);
        setShowEditModal(true);
        // choose-модалка скроется благодаря isChooseOpen
    };

    // После сохранения / закрытия модалки редактирования
    const handleEditOpenChange = (open: boolean) => {
        setShowEditModal(open);
        if (!open) {
            // Модалку редактирования закрыли — закрываем всё
            // (если хотите снова показать choose-модалку, уберите вызов onClose)
            if (onClose) onClose();
            router.refresh();
        }
    };

    const handleSave = (_updatedPost: ExtendedPost) => {
        setShowEditModal(false);
        if (onClose) onClose();
        router.refresh();
    };

    return (
        <>
            {/* ── Модалка просмотра поста ────────────────────── */}
            <Dialog open={isChooseOpen} onOpenChange={handleOpenChange}>
                <DialogContent
                    className={cn(
                        'p-0 gap-0 max-w-[1060px] bg-white overflow-y-auto',
                        className,
                    )}
                >
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold text-gray-800 break-words">
                            {post.post_title || 'Без заголовка'}
                        </DialogTitle>
                    </DialogHeader>

                    <ChoosePostForm
                        post={post}
                        onClose={onClose}
                        onEdit={handleEdit}
                    />
                </DialogContent>
            </Dialog>

            {/* ── Модалка редактирования — ВЫНЕСЕНА наружу ──── */}
            {postForEdit && (
                <PostEditModal
                    post={postForEdit}
                    open={showEditModal}
                    onOpenChange={handleEditOpenChange}
                    onSave={handleSave}
                />
            )}
        </>
    );
};