import { User } from '@/generated/prisma/client';
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
    id: number;
    title: string;
    desc: string | null;

    post_needs_video_smm: boolean;
    post_needs_text: Boolean;
    post_needs_photogallery: Boolean;
    post_needs_cover_photo: Boolean;
    post_needs_photo_cards: Boolean;
    post_needs_video_maker: Boolean;

    post_done_link_video_smm: string | null;
    post_done_link_video_maker: string | null;
    post_done_link_text: string | null;
    post_done_link_photogallery: string | null;
    post_done_link_cover_photo: string | null;
    post_done_link_photo_cards: string | null;

    post_date: Date | null;
    post_deadline: Date;
    post_type: string;
    post_status: string | null;

    className?: string;
}

export const PostCard: React.FC<Props> = ({ 
    className, 
    title, 
    id, 
    desc, 
    post_type, 
    post_date,
    post_deadline,
    post_needs_video_smm,
    post_needs_text,
    post_needs_photogallery,
    post_needs_cover_photo,
    post_needs_photo_cards,
    post_needs_video_maker,
    post_done_link_video_smm,
    post_done_link_video_maker,
    post_done_link_text,
    post_done_link_photogallery,
    post_done_link_cover_photo,
    post_done_link_photo_cards
}) => {
    const getPostStatus = () => {
        const requiredWorks = [
            { needs: post_needs_video_smm, done: post_done_link_video_smm },
            { needs: post_needs_video_maker, done: post_done_link_video_maker },
            { needs: post_needs_text, done: post_done_link_text },
            { needs: post_needs_photogallery, done: post_done_link_photogallery },
            { needs: post_needs_cover_photo, done: post_done_link_cover_photo },
            { needs: post_needs_photo_cards, done: post_done_link_photo_cards }
        ];

        const hasUnfinishedWork = requiredWorks.some(work =>
            work.needs && !work.done
        );

        return hasUnfinishedWork ? "В работе" : "Готово";
    };

    const getStatusColor = () => {
        return getPostStatus() === "Готово" ? "text-green-500" : "text-red-500";
    };

    return (
        <div className={className}>
            <Link href={`/post/${id}`}>
                <div className="bg-[#bfbec7] text-white rounded-2xl overflow-hidden">
                    {/* Верхняя строка: галочка + дата + метки */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className={`${getStatusColor()} font-bold`}>{getPostStatus()}</span>
                            <span className="text-gray-50 font-bold">{post_deadline ? post_deadline.toLocaleDateString() : 'Нет даты'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-2xl">{post_type}</span>
                            {post_needs_video_smm && (
                                <span className={`${post_done_link_video_smm ? '' : 'opacity-50'}`}>🎬</span>
                            )}
                            {post_needs_video_maker && (
                                <span className={`${post_done_link_video_maker ? '' : 'opacity-50'}`}>📹</span>
                            )}
                            {post_needs_text && (
                                <span className={`${post_done_link_text ? '' : 'opacity-50'}`}>📝</span>
                            )}
                            {post_needs_photogallery && (
                                <span className={`${post_done_link_photogallery ? '' : 'opacity-50'}`}>📸</span>
                            )}
                            {post_needs_cover_photo && (
                                <span className={`${post_done_link_cover_photo ? '' : 'opacity-50'}`}>🖼️</span>
                            )}
                            {post_needs_photo_cards && (
                                <span className={`${post_done_link_photo_cards ? '' : 'opacity-50'}`}>📷</span>
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
            </Link>
        </div>
    );
};
