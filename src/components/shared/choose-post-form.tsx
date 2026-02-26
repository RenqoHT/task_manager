'use client';

import { Button } from '@/components/ui/button';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AttachLinksModal, PostEditModal } from './modals';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    className?: string;
}

export const ChoosePostForm: React.FC<Props> = ({ post, className }) => {
    const formatDate = (date: Date | null) => {
        if (!date) return 'Не указана';
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Статус берется из БД (post_status)
    const finalPostStatus = post.post_status || 'В работе';

    const router = useRouter();
    const handleEdit = () => {
        window.dispatchEvent(new CustomEvent('openEditPostModal', { detail: post }));
    };

    const [showEditModal, setShowEditModal] = useState(false);
    const [postForEdit, setPostForEdit] = useState<ExtendedPost | null>(null);
    const [showAttachLinksModal, setShowAttachLinksModal] = useState(false);

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

    const handleAttachLinks = () => {
        setShowAttachLinksModal(true);
    };

    const handleLinksUpdate = (updatedPost: Post) => {
        router.refresh();
    };

    const handleSave = (updatedPost: ExtendedPost) => {
        router.refresh();
    };

    return (
        <div className={cn("p-6 space-y-6", className)}>
            <div className="flex justify-end space-x-3">
                <Button
                    variant="outline"
                    onClick={handleAttachLinks}
                    className="mb-4"
                >
                    Прикрепить ссылки
                </Button>
                <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="mb-4"
                >
                    Редактировать
                </Button>
            </div>

            {postForEdit && (
                <PostEditModal
                    post={postForEdit}
                    open={showEditModal}
                    onOpenChange={setShowEditModal}
                    onSave={handleSave}
                />
            )}

            <AttachLinksModal
                post={post}
                open={showAttachLinksModal}
                onOpenChange={setShowAttachLinksModal}
                onLinksUpdated={handleLinksUpdate}
            />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Основная информация</h3>

                <div className="grid grid-cols-2 gap-4">
                
                    <div>
                        <p className="text-sm text-gray-500">Статус</p>
                        <p className={`font-medium ${
                            finalPostStatus === 'Готово' ? 'text-green-600' :
                            finalPostStatus === 'В работе' ? 'text-red-600' :
                            'text-gray-600'
                        }`}>
                            {finalPostStatus}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Дата создания</p>
                        <p className="font-medium">{formatDate(post.post_date)}</p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Крайний срок</p>
                        <p className="font-medium">{formatDate(post.post_deadline)}</p>
                    </div>
                    
                    {post.responsible_person_id && (
                        <div>
                            <p className="text-sm text-gray-500">Ответственный</p>
                            <p className="font-medium">
                                {post.user?.user_login || `ID: ${post.responsible_person_id}`}
                            </p>
                        </div>
                    )}

                    {post.tz_link && (
                        <div>
                            <p className="text-sm text-gray-500">Ссылка на ТЗ</p>
                            <a 
                                href={post.tz_link.startsWith('http') ? post.tz_link : `https://${post.tz_link}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
                            >
                                {post.tz_link}
                            </a>
                        </div>
                    )}
                </div>
                
                {post.post_description && (
                    <div>
                        <p className="text-sm text-gray-500">Описание</p>
                        <div className='rounded-md max-h-[200px] max-w-[445px] overflow-auto'>
                            <p className="max-w-[400px] break-words font-medium mt-1 whitespace-pre-line">{post.post_description}</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Требуемые работы</h3>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {post.post_needs_mini_video_smm && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Мини-видео SMM:</span>
                            <span className={`font-medium ${post.post_done_link_mini_video_smm ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_mini_video_smm ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_video && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Видео:</span>
                            <span className={`font-medium ${post.post_done_link_video ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_video ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_text && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Текст:</span>
                            <span className={`font-medium ${post.post_done_link_text ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_text ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_photogallery && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Фотогалерея:</span>
                            <span className={`font-medium ${post.post_done_link_photogallery ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_photogallery ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_cover_photo && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Обложка:</span>
                            <span className={`font-medium ${post.post_done_link_cover_photo ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_cover_photo ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_photo_cards && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Фотокарточки:</span>
                            <span className={`font-medium ${post.post_done_link_photo_cards ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_photo_cards ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_mini_gallery && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Мини-галерея:</span>
                            <span className={`font-medium ${post.post_done_link_mini_gallery ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_mini_gallery ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
