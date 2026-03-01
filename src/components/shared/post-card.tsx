import { User, Tag, PostTag } from '@/generated/prisma/client';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface PostTagWithTag extends PostTag {
    tag: Tag;
}

interface Props {
    id: number;
    title: string;
    desc: string | null;

    post_needs_mini_video_smm: boolean;
    post_needs_video: boolean;
    post_needs_text: boolean;
    post_needs_photogallery: boolean;
    post_needs_cover_photo: boolean;
    post_needs_photo_cards: boolean;
    post_needs_mini_gallery: boolean;

    post_done_link_mini_video_smm: string | null;
    post_done_link_video: string | null;
    post_done_link_text: string | null;
    post_done_link_photogallery: string | null;
    post_done_link_cover_photo: string | null;
    post_done_link_photo_cards: string | null;
    post_done_link_mini_gallery: string | null;

    post_date: Date | null;
    post_deadline: Date;
    post_status: string;

    tags?: PostTagWithTag[];

    className?: string;
    onClick?: () => void;
}

export const PostCard: React.FC<Props> = ({ 
    className, 
    title, 
    id, 
    onClick,
    desc, 
    post_deadline,
    post_status,
    post_needs_mini_video_smm,
    post_needs_video,
    post_needs_text,
    post_needs_photogallery,
    post_needs_cover_photo,
    post_needs_photo_cards,
    post_needs_mini_gallery,
    post_done_link_mini_video_smm,
    post_done_link_video,
    post_done_link_text,
    post_done_link_photogallery,
    post_done_link_cover_photo,
    post_done_link_photo_cards,
    post_done_link_mini_gallery,
    tags
}) => {
    // Статус берется из БД
    const getStatusColor = () => {
        return post_status === "Готово" ? "text-green-500" : "text-red-500";
    };

    return (
        <div className={className} onClick={onClick}>
            <div className="bg-[#bfbec7] text-white rounded-2xl overflow-hidden cursor-pointer">
                    {/* Верхняя строка: статус + дата + метки */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className={`${getStatusColor()} font-bold`}>{post_status || 'В работе'}</span>
                            <span className="text-gray-50 font-bold">{post_deadline ? post_deadline.toLocaleDateString() : 'Нет даты'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {post_needs_mini_video_smm && (
                                <span className={`${post_done_link_mini_video_smm ? '' : 'opacity-50'}`} title="Мини-видео SMM">🎬</span>
                            )}
                            {post_needs_video && (
                                <span className={`${post_done_link_video ? '' : 'opacity-50'}`} title="Видео">📹</span>
                            )}
                            {post_needs_text && (
                                <span className={`${post_done_link_text ? '' : 'opacity-50'}`} title="Текст">📝</span>
                            )}
                            {post_needs_photogallery && (
                                <span className={`${post_done_link_photogallery ? '' : 'opacity-50'}`} title="Фотогалерея">📸</span>
                            )}
                            {post_needs_cover_photo && (
                                <span className={`${post_done_link_cover_photo ? '' : 'opacity-50'}`} title="Обложка">🖼️</span>
                            )}
                            {post_needs_photo_cards && (
                                <span className={`${post_done_link_photo_cards ? '' : 'opacity-50'}`} title="Фотокарточки">📷</span>
                            )}
                            {post_needs_mini_gallery && (
                                <span className={`${post_done_link_mini_gallery ? '' : 'opacity-50'}`} title="Мини-галерея">🖼️</span>
                            )}
                        </div>
                    </div>

                    {/* Основной контент */}
                    <div className="px-4 pb-4">
                        <Title
                            text={title}
                            size="md"
                            className="font-bold leading-tight mb-1.5"
                        />

                        {/* Тэги */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {tags.slice(0, 3).map((postTag, index) => (
                                    <span
                                        key={`${postTag.tag_id}-${index}`}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                                        style={{ backgroundColor: postTag.tag.color }}
                                    >
                                        {postTag.tag.name}
                                    </span>
                                ))}
                                {tags.length > 3 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-500 text-white">
                                        +{tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Короткое описание (если есть) */}
                        {desc && (
                            <p className="text-xl text-gray-100 line-clamp-2 mb-3">
                                {desc}
                            </p>
                        )}

                        {/* Кнопка */}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-sm font-medium px-4 py-1.5"
                        >
                            Подробнее
                        </Button>
                    </div>
                </div>
        </div>
    );
};
