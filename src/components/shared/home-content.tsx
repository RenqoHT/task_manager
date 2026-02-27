'use client';

import React, { useState } from 'react';
import { PostGroupList } from './post-group-list';
import { ChoosePostModal } from './modals/choose-post-modal';
import { Post, User } from '@/generated/prisma/client';

interface ExtendedPost extends Post {
    user?: User | null;
}

interface Props {
    posts: ExtendedPost[];
}

export const HomeContent: React.FC<Props> = ({ posts }) => {

    const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);

    const handlePostClick = (post: ExtendedPost) => {
        setSelectedPost(post);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    return (
        <>

            <PostGroupList 
                items={posts} 
                onPostClick={handlePostClick}
            />
            
            {selectedPost && (
                <ChoosePostModal 
                    post={selectedPost} 
                    onClose={handleCloseModal}
                />
            )}

        </>
    );
};
