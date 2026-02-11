import React from 'react';
import { PostCard } from './post-card';

interface Props {
    className?: string;
    items: any[];
}


export const PostGroupList: React.FC<Props> = ({ className, items }) => {
    return (
        <div className={className}>
            <div className='flex flex-col gap-5'>
                {
                items.map((post, i) => (
                    <PostCard
                        key={post.post_id}
                        id={post.post_id}
                        title={post.post_title}
                        desc={post.post_description}
                        post_needs_video_smm={post.post_needs_video_smm}
                        post_needs_video_maker={post.post_needs_video_maker}
                        post_needs_text={post.post_needs_text}
                        post_needs_photogallery={post.post_needs_photogallery}
                        post_needs_cover_photo={post.post_needs_cover_photo}
                        post_needs_photo_cards={post.post_needs_photo_cards}
                        post_done_link_video_smm={post.post_done_link_video_smm}
                        post_done_link_video_maker={post.post_done_link_video_maker}
                        post_done_link_text={post.post_done_link_text}
                        post_done_link_photogallery={post.post_done_link_photogallery}
                        post_done_link_cover_photo={post.post_done_link_cover_photo}
                        post_done_link_photo_cards={post.post_done_link_photo_cards}
                        post_date={post.post_date}
                        post_deadline={post.post_deadline}
                        post_type={post.post_type}
                        post_status={post.post_status}                    />
                ))
                }
            </div>
        </div>
    );
};
