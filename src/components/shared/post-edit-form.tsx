'use client';

import { Button, Input, UserSelect } from '@/components/ui';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { Api } from './services/api-client';
import { PostUpdateData } from './services/posts';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    open: boolean;
    post: ExtendedPost;
    className?: string;
    onSave?: (updatedPost: ExtendedPost) => void;
    onCancel?: () => void;
}

export const PostEditForm: React.FC<Props> = ({ post, className, onSave, onCancel, open }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState(post.post_title);
    const [description, setDescription] = useState(post.post_description || '');
    const [needsVideoSmm, setNeedsVideoSmm] = useState(post.post_needs_video_smm);
    const [needsVideoMaker, setNeedsVideoMaker] = useState(post.post_needs_video_maker);
    const [needsText, setNeedsText] = useState(post.post_needs_text);
    const [needsPhotogallery, setNeedsPhotogallery] = useState(post.post_needs_photogallery);
    const [needsCoverPhoto, setNeedsCoverPhoto] = useState(post.post_needs_cover_photo);
    const [needsPhotoCards, setNeedsPhotoCards] = useState(post.post_needs_photo_cards);
    const [doneLinkVideoSmm, setDoneLinkVideoSmm] = useState(post.post_done_link_video_smm || '');
    const [doneLinkVideoMaker, setDoneLinkVideoMaker] = useState(post.post_done_link_video_maker || '');
    const [doneLinkText, setDoneLinkText] = useState(post.post_done_link_text || '');
    const [doneLinkPhotogallery, setDoneLinkPhotogallery] = useState(post.post_done_link_photogallery || '');
    const [doneLinkCoverPhoto, setDoneLinkCoverPhoto] = useState(post.post_done_link_cover_photo || '');
    const [doneLinkPhotoCards, setDoneLinkPhotoCards] = useState(post.post_done_link_photo_cards || '');
    const [responsiblePersonId, setResponsiblePersonId] = useState<number | null>(post.responsible_person_id);
    const [deadline, setDeadline] = useState(() => {
        // Преобразуем дату в формат YYYY-MM-DDTHH:mm для datetime-local
        if (post.post_deadline) {
            const date = new Date(post.post_deadline);
            return date.toISOString().slice(0, 16);
        }
        return '';
    });
    const [type, setType] = useState(post.post_type);

    // Загрузка пользователей при монтировании
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await Api.users.getUsers();
                setUsers(userData);
            } catch (err) {
                console.error('Ошибка при загрузке пользователей:', err);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (responsiblePersonId === null || responsiblePersonId === undefined) {
                setError('Пожалуйста, выберите ответственного пользователя');
                setLoading(false);
                return;
            }

            const updatedPost: PostUpdateData = {
                post_title: title,
                post_description: description,
                post_needs_video_smm: needsVideoSmm,
                post_needs_video_maker: needsVideoMaker,
                post_needs_text: needsText,
                post_needs_photogallery: needsPhotogallery,
                post_needs_cover_photo: needsCoverPhoto,
                post_needs_photo_cards: needsPhotoCards,
                post_done_link_video_smm: doneLinkVideoSmm || null,
                post_done_link_video_maker: doneLinkVideoMaker || null,
                post_done_link_text: doneLinkText || null,
                post_done_link_photogallery: doneLinkPhotogallery || null,
                post_done_link_cover_photo: doneLinkCoverPhoto || null,
                post_done_link_photo_cards: doneLinkPhotoCards || null,
                responsible_person_id: responsiblePersonId,
                post_deadline: new Date(deadline),
                post_type: type,
            };

            // Отправляем запрос на обновление поста
            const response = await Api.posts.update(post.post_id, updatedPost);

            // Вызываем колбэк с обновленным постом
            if (onSave) {
                onSave(response);
            }
        } catch (err) {
            console.error('Ошибка при обновлении поста:', err);
            setError('Произошла ошибка при обновлении поста. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("p-6 space-y-4", className)}>
            {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Название поста *
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Тип поста *
                    </label>
                    <Input
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
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
                        onChange={(e) => setDeadline(e.target.value)}
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
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Требуемые работы:</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Отмена
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </div>
        </form>
    );
};