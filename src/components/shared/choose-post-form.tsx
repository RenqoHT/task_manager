'use client';

import { Button } from '@/components/ui/button';
import { Post, User } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import React from 'react';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    post: ExtendedPost;
    className?: string;
}

export const ChoosePostForm: React.FC<Props> = ({ post, className }) => {
    // Форматирование даты
    const formatDate = (date: Date | null) => {
        if (!date) return 'Не указана';
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Форматирование булевых значений
    const formatBoolean = (value: boolean) => {
        return value ? 'Да' : 'Нет';
    };

    // Форматирование ссылок
    const formatLink = (link: string | null) => {
        if (!link) return 'Не указано';
        return (
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
            >
                {link}
            </a>
        );
    };

    // Функция для определения статуса выполнения всех работ
    const getAllWorksStatus = () => {
        // Проверяем, все ли требуемые работы выполнены
        const requiredWorks = [
            { needs: post.post_needs_video_smm, done: post.post_done_link_video_smm },
            { needs: post.post_needs_video_maker, done: post.post_done_link_video_maker },
            { needs: post.post_needs_text, done: post.post_done_link_text },
            { needs: post.post_needs_photogallery, done: post.post_done_link_photogallery },
            { needs: post.post_needs_cover_photo, done: post.post_done_link_cover_photo },
            { needs: post.post_needs_photo_cards, done: post.post_done_link_photo_cards }
        ];

        // Проверяем, есть ли хотя бы одна требуемая работа, которая не выполнена
        const hasUnfinishedWork = requiredWorks.some(work => 
            work.needs && !work.done
        );

        // Если есть незавершенная работа, возвращаем false
        if (hasUnfinishedWork) {
            return false;
        }

        // Если все требуемые работы выполнены, возвращаем true
        return true;
    };

    // Определяем финальный статус поста
    const finalPostStatus = getAllWorksStatus() ? 'Выполнено' : (post.post_status || 'Не указан');

    return (
        <div className={cn("p-6 space-y-6", className)}>
            {/* Блок основной информации */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Основная информация</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Тип поста</p>
                        <p className="font-medium">{post.post_type}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Статус</p>
                        <p className={`font-medium ${
                            finalPostStatus === 'Выполнено' ? 'text-green-600' :
                            finalPostStatus === 'Ожидает начала' ? 'text-blue-600' :
                            'text-gray-600'
                        }`}>
                            {finalPostStatus}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Дата создания</p>
                        <p className="font-medium">{formatDate(post.post_date)}</p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Крайний срок</p>
                        <p className="font-medium">{formatDate(post.post_deadline)}</p>
                    </div>
                    
                    {post.responsible_person_id && (
                        <div>
                            <p className="text-sm text-gray-500">Ответственный</p>
                            <p className="font-medium">
                                {post.user?.user_login || `ID: ${post.responsible_person_id}`}
                            </p>
                        </div>
                    )}
                </div>
                
                {post.post_description && (
                    <div>
                        <p className="text-sm text-gray-500">Описание</p>
                        <div className='rounded-md max-h-[200px] max-w-[445px] overflow-auto'>
                            <p className="max-w-[400px] break-words font-medium mt-1 whitespace-pre-line">{post.post_description}</p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum magnam unde nihil, consequuntur dignissimos praesentium. Quo rerum architecto, veritatis quam quos harum sint suscipit magni sit ducimus dolores soluta ratione corrupti ex consequatur rem assumenda error autem dignissimos mollitia numquam quas dicta sunt itaque? Maiores voluptates porro nobis nostrum, qui, rem iste, totam magni quibusdam repudiandae corrupti vitae. Doloremque magni excepturi velit beatae consequatur blanditiis facilis mollitia ducimus a quas asperiores quae repellat corrupti, neque laudantium sint possimus. Explicabo laborum deleniti suscipit iusto illo accusamus ullam fugit amet aliquid accusantium nobis eligendi error quis iure nulla sunt quia cupiditate autem ratione est, veritatis delectus ex similique ipsam! Quibusdam, voluptate. Recusandae, cum. Reprehenderit beatae, ratione dolorem quae, quis obcaecati maxime dignissimos, iste sed laborum voluptatum? Nisi maxime qui suscipit doloribus tenetur ullam in quis! Molestiae pariatur, facere quibusdam porro tenetur voluptatum sunt voluptate et quia expedita earum a eveniet, voluptatibus numquam nobis in? Voluptatibus beatae eaque, nulla voluptatem iure labore molestiae a fuga. Unde, dolor quis reprehenderit alias possimus ut voluptates explicabo distinctio cumque reiciendis molestiae, quasi consectetur iste, repudiandae libero esse neque qui quo iure magni delectus! Qui, enim beatae aspernatur esse reiciendis nulla quia aperiam a voluptate, facilis incidunt eius? Praesentium quos nam suscipit est, facilis libero in voluptatum similique, officiis reiciendis hic minus nostrum cumque! Unde libero dolorem voluptatibus fugit tempore sequi quaerat? Delectus sequi earum veritatis perspiciatis minus reiciendis quas in, quod unde vitae esse aut, sit natus, tempore assumenda eligendi. Vitae nisi ea iste quo porro possimus nam, cumque ut cupiditate eaque id earum fugiat asperiores voluptatum necessitatibus sed qui dolorum aperiam magnam repellat in error veniam dolor? Sed voluptas provident nulla nesciunt quibusdam impedit ipsa maiores deserunt doloribus eaque minus quisquam, temporibus obcaecati accusamus magni neque nemo, expedita odit reprehenderit? Id et amet explicabo quo beatae, consequatur nemo minima. Exercitationem autem consequuntur at quisquam quae quod qui, deserunt obcaecati, possimus similique a laudantium beatae rerum animi vero perferendis! Necessitatibus non quasi quibusdam, officiis, quod debitis ea maiores doloribus itaque aliquid dolorum eum facere, optio reprehenderit molestiae hic deleniti. Eligendi, maiores fuga ad omnis quo quidem accusantium quas possimus ipsam at debitis vel distinctio quaerat libero doloribus reiciendis quod, quibusdam ratione et mollitia assumenda repellat soluta. Rem tempore ipsa, aut nesciunt consequuntur ipsam dolorum repudiandae esse consectetur facere non unde delectus cumque eius ullam quod dicta asperiores placeat minus illo. Culpa deleniti sunt eveniet vitae animi.
                        </div>
                    </div>
                )}
            </div>
            
            {/* Блок требований к работе */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-4">Требуемые работы</h3>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {post.post_needs_video_smm && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Видео SMM:</span>
                            <span className={`font-medium ${post.post_done_link_video_smm ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_video_smm ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_video_maker && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Видео-мейкер:</span>
                            <span className={`font-medium ${post.post_done_link_video_maker ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_video_maker ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_text && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Текст:</span>
                            <span className={`font-medium ${post.post_done_link_text ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_text ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_photogallery && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Фотогалерея:</span>
                            <span className={`font-medium ${post.post_done_link_photogallery ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_photogallery ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_cover_photo && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Обложка:</span>
                            <span className={`font-medium ${post.post_done_link_cover_photo ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_cover_photo ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}

                    {post.post_needs_photo_cards && (
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-500">Фотокарточки:</span>
                            <span className={`font-medium ${post.post_done_link_photo_cards ? 'text-green-600' : 'text-red-600'}`}>
                                {post.post_done_link_photo_cards ? 'Готово' : 'Не готово'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Блок выполненных работ */}
            {/* {(post.post_done_link_video_smm || 
              post.post_done_link_video_maker || 
              post.post_done_link_text || 
              post.post_done_link_photogallery || 
              post.post_done_link_cover_photo || 
              post.post_done_link_photo_cards) && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Выполненные работы</h3>
                    
                    <div className="space-y-3">
                        {post.post_done_link_video_smm && (
                            <div>
                                <p className="text-sm text-gray-500">Видео SMM</p>
                                <p className="font-medium">{formatLink(post.post_done_link_video_smm)}</p>
                            </div>
                        )}
                        
                        {post.post_done_link_video_maker && (
                            <div>
                                <p className="text-sm text-gray-500">Видео-мейкер</p>
                                <p className="font-medium">{formatLink(post.post_done_link_video_maker)}</p>
                            </div>
                        )}
                        
                        {post.post_done_link_text && (
                            <div>
                                <p className="text-sm text-gray-500">Текст</p>
                                <p className="font-medium">{formatLink(post.post_done_link_text)}</p>
                            </div>
                        )}
                        
                        {post.post_done_link_photogallery && (
                            <div>
                                <p className="text-sm text-gray-500">Фотогалерея</p>
                                <p className="font-medium">{formatLink(post.post_done_link_photogallery)}</p>
                            </div>
                        )}
                        
                        {post.post_done_link_cover_photo && (
                            <div>
                                <p className="text-sm text-gray-500">Обложка</p>
                                <p className="font-medium">{formatLink(post.post_done_link_cover_photo)}</p>
                            </div>
                        )}
                        
                        {post.post_done_link_photo_cards && (
                            <div>
                                <p className="text-sm text-gray-500">Фотокарточки</p>
                                <p className="font-medium">{formatLink(post.post_done_link_photo_cards)}</p>
                            </div>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
};
