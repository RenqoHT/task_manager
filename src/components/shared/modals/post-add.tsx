'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Input,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui';
import { UserSelect } from '@/components/ui/user-select';
import { User, Post } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Api } from '../services/api-client';
import { PostCreationData } from '../services/posts';
import { useClickAway } from 'react-use';


interface Props {
    className?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PostAdd: React.FC<Props> = ({ className, open, onOpenChange }) => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [needsMiniVideoSmm, setNeedsMiniVideoSmm] = useState(false);
    const [needsVideo, setNeedsVideo] = useState(false);
    const [needsText, setNeedsText] = useState(true);
    const [needsPhotogallery, setNeedsPhotogallery] = useState(false);
    const [needsCoverPhoto, setNeedsCoverPhoto] = useState(false);
    const [needsPhotoCards, setNeedsPhotoCards] = useState(false);
    const [needsMiniGallery, setNeedsMiniGallery] = useState(false);
    const [responsiblePersonId, setResponsiblePersonId] = useState<number | null>(null);
    const [deadline, setDeadline] = useState('');
    const [tzLink, setTzLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Проверяем, что дедлайн заполнен
            if (!deadline) {
                setError('Пожалуйста, укажите крайний срок');
                setLoading(false);
                return;
            }

            // Проверим, что выбран ответственный пользователь
            if (responsiblePersonId === null || responsiblePersonId === undefined) {
                setError('Пожалуйста, выберите ответственного пользователя');
                setLoading(false);
                return;
            }

            const deadlineDate = new Date(deadline);

            const postData: PostCreationData = {
                post_title: title,
                post_description: description || null,
                post_needs_mini_video_smm: needsMiniVideoSmm,
                post_needs_video: needsVideo,
                post_needs_text: needsText,
                post_needs_photogallery: needsPhotogallery,
                post_needs_cover_photo: needsCoverPhoto,
                post_needs_photo_cards: needsPhotoCards,
                post_needs_mini_gallery: needsMiniGallery,
                tz_link: tzLink || null,
                responsible_person_id: responsiblePersonId,
                post_deadline: deadlineDate,
            };

            await Api.posts.create(postData);

            // Закрываем модалку и обновляем страницу
            onOpenChange(false);

            // Обновляем страницу для отображения нового поста
            router.refresh();
        } catch (err) {
            console.error('Ошибка при создании поста:', err);
            setError('Произошла ошибка при создании поста. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setTitle('');
        setDescription('');
        setNeedsMiniVideoSmm(false);
        setNeedsVideo(false);
        setNeedsText(true);
        setNeedsPhotogallery(false);
        setNeedsCoverPhoto(false);
        setNeedsPhotoCards(false);
        setNeedsMiniGallery(false);
        setResponsiblePersonId(null);
        setDeadline('');
        setTzLink('');
        setError('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('p-0 gap-0 max-w-[600px] bg-white', className)}>
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Создать новый пост
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 pt-0 space-y-4">
                        {error && (
                            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Название поста *
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="Введите название поста"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description-textarea" className="block text-sm font-medium text-gray-700 mb-1">
                                Описание
                            </label>
                            <textarea
                                id="description-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Введите описание поста"
                                className="w-full min-h-[100px] max-h-50 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                Крайний срок *
                            </label>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={deadline}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="tzLink" className="block text-sm font-medium text-gray-700 mb-1">
                                Ссылка на ТЗ
                            </label>
                            <Input
                                id="tzLink"
                                value={tzLink}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTzLink(e.target.value)}
                                placeholder="Введите ссылку на техническое задание"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ответственный
                            </label>
                            <UserSelect
                                key={open ? 'user-select-open' : 'user-select-closed'}
                                value={responsiblePersonId}
                                onChange={setResponsiblePersonId}
                                placeholder="Поиск пользователя..."
                            />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Требуемые работы:</h3>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsMiniVideoSmm"
                                    checked={needsMiniVideoSmm}
                                    onChange={(e) => setNeedsMiniVideoSmm(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsMiniVideoSmm" className="ml-2 block text-sm text-gray-700">
                                    Мини-видео SMM
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsVideo"
                                    checked={needsVideo}
                                    onChange={(e) => setNeedsVideo(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsVideo" className="ml-2 block text-sm text-gray-700">
                                    Видео
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsPhotogallery"
                                    checked={needsPhotogallery}
                                    onChange={(e) => setNeedsPhotogallery(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsPhotogallery" className="ml-2 block text-sm text-gray-700">
                                    Фотогалерея
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsCoverPhoto"
                                    checked={needsCoverPhoto}
                                    onChange={(e) => setNeedsCoverPhoto(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsCoverPhoto" className="ml-2 block text-sm text-gray-700">
                                    Обложка
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsPhotoCards"
                                    checked={needsPhotoCards}
                                    onChange={(e) => setNeedsPhotoCards(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsPhotoCards" className="ml-2 block text-sm text-gray-700">
                                    Фотокарточки
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsMiniGallery"
                                    checked={needsMiniGallery}
                                    onChange={(e) => setNeedsMiniGallery(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsMiniGallery" className="ml-2 block text-sm text-gray-700">
                                    Мини-галерея
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0">
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
                            {loading ? 'Создание...' : 'Создать пост'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
