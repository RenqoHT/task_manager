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
        miniVideoSmm: post.post_done_link_mini_video_smm || '',
        video: post.post_done_link_video || '',
        text: post.post_done_link_text || '',
        photogallery: post.post_done_link_photogallery || '',
        coverPhoto: post.post_done_link_cover_photo || '',
        photoCards: post.post_done_link_photo_cards || '',
        miniGallery: post.post_done_link_mini_gallery || ''
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
            const updatedPost = await Api.posts.update(post.post_id, {
                post_done_link_mini_video_smm: links.miniVideoSmm || null,
                post_done_link_video: links.video || null,
                post_done_link_text: links.text || null,
                post_done_link_photogallery: links.photogallery || null,
                post_done_link_cover_photo: links.coverPhoto || null,
                post_done_link_photo_cards: links.photoCards || null,
                post_done_link_mini_gallery: links.miniGallery || null
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

                        {post.post_needs_mini_video_smm && (
                            <div>
                                <label htmlFor="miniVideoSmm" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на мини-видео SMM
                                </label>
                                <Input
                                    id="miniVideoSmm"
                                    value={links.miniVideoSmm}
                                    onChange={(e) => handleChange('miniVideoSmm', e.target.value)}
                                    placeholder="https://example.com/mini-video-smm"
                                />
                            </div>
                        )}

                        {post.post_needs_video && (
                            <div>
                                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на видео
                                </label>
                                <Input
                                    id="video"
                                    value={links.video}
                                    onChange={(e) => handleChange('video', e.target.value)}
                                    placeholder="https://example.com/video"
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

                        {post.post_needs_mini_gallery && (
                            <div>
                                <label htmlFor="miniGallery" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ссылка на мини-галерею
                                </label>
                                <Input
                                    id="miniGallery"
                                    value={links.miniGallery}
                                    onChange={(e) => handleChange('miniGallery', e.target.value)}
                                    placeholder="https://example.com/mini-gallery"
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
