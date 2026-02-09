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

    // User: User | null;

    className?: string;
}

export const PostCard: React.FC<Props> = ({ className, title, id, desc, post_type, post_date }) => {
    return (
        <div className={className}>
            <Link href={`/post/${id}`}>
                <div className="bg-[#cecff1] text-white rounded-2xl overflow-hidden">
                    {/* Верхняя строка: галочка + дата + метки */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 font-bold">✓</span>
                            <span className="text-gray-50 font-bold">{post_date ? post_date.toLocaleDateString() : 'Нет даты'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {(
                                <>
                                    <span className="text-white font-bold text-2xl">{post_type}</span>
                                    <span>📸</span>
                                    <span>🖼️</span>
                                </>
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
