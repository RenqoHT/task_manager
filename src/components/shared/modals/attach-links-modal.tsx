'use client';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@/components/ui';
import { Post } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Api } from '../services/api-client';

interface Props {
    post: Post;
    className?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLinksUpdated?: (updatedPost: Post) => void;
}

export const AttachLinksModal: React.FC<Props> = ({
    post,
    className,
    open,
    onOpenChange,
    onLinksUpdated
}) => {
    const [links, setLinks] = useState({
        videoSmm: post.post_done_link_video_smm || '',
        videoMaker: post.post_done_link_video_maker || '',
        text: post.post_done_link_text || '',
        photogallery: post.post_done_link_photogallery || '',
        coverPhoto: post.post_done_link_cover_photo || '',
        photoCards: post.post_done_link_photo_cards || ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field: keyof typeof links, value: string) => {
        setLinks(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Обновляем пост с новыми ссылками
            const updatedPost = await Api.posts.update(post.post_id, {
                post_done_link_video_smm: links.videoSmm || null,
                post_done_link_video_maker: links.videoMaker || null,
                post_done_link_text: links.text || null,
                post_done_link_photogallery: links.photogallery || null,
                post_done_link_cover_photo: links.coverPhoto || null,
                post_done_link_photo_cards: links.photoCards || null
            });

            if (onLinksUpdated) {
                onLinksUpdated(updatedPost);
            }

            onOpenChange(false);
        } catch (err) {
            console.error('Ошибка при обновлении ссылок:', err);
            setError('Произошла ошибка при сохранении ссылок. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setError('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('p-0 gap-0 max-w-[600px] bg-white', className)}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Прикрепить ссылки к посту
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 pt-0 space-y-4 max-h-[70vh] overflow-y-auto">
                        {error && (
                            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        {post.post_needs_video_smm && (
                            <div>
                                <label htmlFor="videoSmm" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на видео SMM
                                </label>
                                <Input
                                    id="videoSmm"
                                    value={links.videoSmm}
                                    onChange={(e) => handleChange('videoSmm', e.target.value)}
                                    placeholder="https://example.com/video-smm"
                                />
                            </div>
                        )}

                        {post.post_needs_video_maker && (
                            <div>
                                <label htmlFor="videoMaker" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на видео-мейкер
                                </label>
                                <Input
                                    id="videoMaker"
                                    value={links.videoMaker}
                                    onChange={(e) => handleChange('videoMaker', e.target.value)}
                                    placeholder="https://example.com/video-maker"
                                />
                            </div>
                        )}

                        {post.post_needs_text && (
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на текст
                                </label>
                                <Input
                                    id="text"
                                    value={links.text}
                                    onChange={(e) => handleChange('text', e.target.value)}
                                    placeholder="https://example.com/text"
                                />
                            </div>
                        )}

                        {post.post_needs_photogallery && (
                            <div>
                                <label htmlFor="photogallery" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на фотогалерею
                                </label>
                                <Input
                                    id="photogallery"
                                    value={links.photogallery}
                                    onChange={(e) => handleChange('photogallery', e.target.value)}
                                    placeholder="https://example.com/photogallery"
                                />
                            </div>
                        )}

                        {post.post_needs_cover_photo && (
                            <div>
                                <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на обложку
                                </label>
                                <Input
                                    id="coverPhoto"
                                    value={links.coverPhoto}
                                    onChange={(e) => handleChange('coverPhoto', e.target.value)}
                                    placeholder="https://example.com/cover-photo"
                                />
                            </div>
                        )}

                        {post.post_needs_photo_cards && (
                            <div>
                                <label htmlFor="photoCards" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на фотокарточки
                                </label>
                                <Input
                                    id="photoCards"
                                    value={links.photoCards}
                                    onChange={(e) => handleChange('photoCards', e.target.value)}
                                    placeholder="https://example.com/photo-cards"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-6 pt-0 flex justify-end space-x-3 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить ссылки'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};