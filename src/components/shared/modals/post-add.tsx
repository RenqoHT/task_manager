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

    // Состояния для полей формы
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [needsVideoSmm, setNeedsVideoSmm] = useState(false);
    const [needsVideoMaker, setNeedsVideoMaker] = useState(false);
    const [needsText, setNeedsText] = useState(false);
    const [needsPhotogallery, setNeedsPhotogallery] = useState(false);
    const [needsCoverPhoto, setNeedsCoverPhoto] = useState(false);
    const [needsPhotoCards, setNeedsPhotoCards] = useState(false);
    const [responsiblePersonId, setResponsiblePersonId] = useState<number | null>(null);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [type, setType] = useState('');
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

            // Преобразуем строку дедлайна в объект Date
            const deadlineDate = new Date(deadline);

            // Подготовим данные для отправки
            const postData: PostCreationData = {
                post_title: title,
                post_description: description || null,
                post_needs_video_smm: needsVideoSmm,
                post_needs_video_maker: needsVideoMaker,
                post_needs_text: needsText,
                post_needs_photogallery: needsPhotogallery,
                post_needs_cover_photo: needsCoverPhoto,
                post_needs_photo_cards: needsPhotoCards,
                responsible_person_id: responsiblePersonId,
                post_deadline: deadlineDate,
                post_type: type,
            };

            // Отправляем запрос на создание поста
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
        // Сброс состояний при закрытии
        setTitle('');
        setDescription('');
        setNeedsVideoSmm(false);
        setNeedsVideoMaker(false);
        setNeedsText(false);
        setNeedsPhotogallery(false);
        setNeedsCoverPhoto(false);
        setNeedsPhotoCards(false);
        setResponsiblePersonId(null);
        setDeadline('');
        setType('');
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
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Тип поста *
                            </label>
                            <Input
                                id="type"
                                value={type}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)}
                                placeholder="Введите тип поста"
                                required
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
                                    id="needsVideoSmm"
                                    checked={needsVideoSmm}
                                    onChange={(e) => setNeedsVideoSmm(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsVideoSmm" className="ml-2 block text-sm text-gray-700">
                                    Видео SMM
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsVideoMaker"
                                    checked={needsVideoMaker}
                                    onChange={(e) => setNeedsVideoMaker(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsVideoMaker" className="ml-2 block text-sm text-gray-700">
                                    Видео-мейкер
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="needsText"
                                    checked={needsText}
                                    onChange={(e) => setNeedsText(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="needsText" className="ml-2 block text-sm text-gray-700">
                                    Текст
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
