import React, { useMemo } from 'react';
import { PostCard } from './post-card';

interface Props {
    className?: string;
    items: any[];
}

export const PostGroupList: React.FC<Props> = ({ className, items }) => {
    // Сортируем массив по дате (новые сверху) и кешируем результат
    const sortedItems = useMemo(() => {
        // Создаем копию через [...items], чтобы не мутировать пропсы
        return [...items].sort((a, b) => {
            const dateA = a.post_date ? new Date(a.post_date).getTime() : 0;
            const dateB = b.post_date ? new Date(b.post_date).getTime() : 0;
            // Вычитаем B - A для сортировки по убыванию (новые в начале)
            return dateB - dateA;
        });
    }, [items]);

    return (
        <div className={className}>
            <div className='flex flex-col gap-5'>
                {sortedItems.map((post) => (
                    <PostCard
                        key={post.post_id}
                        id={post.post_id}
                        title={post.post_title}
                        desc={post.post_description}
                        post_needs_mini_video_smm={post.post_needs_mini_video_smm}
                        post_needs_video={post.post_needs_video}
                        post_needs_text={post.post_needs_text}
                        post_needs_photogallery={post.post_needs_photogallery}
                        post_needs_cover_photo={post.post_needs_cover_photo}
                        post_needs_photo_cards={post.post_needs_photo_cards}
                        post_needs_mini_gallery={post.post_needs_mini_gallery}
                        post_done_link_mini_video_smm={post.post_done_link_mini_video_smm}
                        post_done_link_video={post.post_done_link_video}
                        post_done_link_text={post.post_done_link_text}
                        post_done_link_photogallery={post.post_done_link_photogallery}
                        post_done_link_cover_photo={post.post_done_link_cover_photo}
                        post_done_link_photo_cards={post.post_done_link_photo_cards}
                        post_done_link_mini_gallery={post.post_done_link_mini_gallery}
                        post_date={post.post_date}
                        post_deadline={post.post_deadline}
                        post_status={post.post_status}
                    />
                ))}
            </div>
        </div>
    );
};
