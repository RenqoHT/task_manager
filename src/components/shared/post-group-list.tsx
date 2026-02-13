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
                        // Передаем явные пропсы для несовпадающих имен полей
                        id={post.post_id}
                        title={post.post_title}
                        desc={post.post_description}
                        // Остальные поля совпадают по названию, используем спред
                        {...post}
                    />
                ))}
            </div>
        </div>
    );
};