'use client';

import { Post } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useClickAway, useDebounce } from 'react-use';
import { Api } from './services/api-client';

interface Props {
    className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [focused, setFocused] = React.useState(false);
    const [posts, setPosts] = React.useState<Post[]>([]);
    const ref = React.useRef(null);

    useClickAway(ref, () => {
        setFocused(false);
    });

    useDebounce(
        async () => {
            try {
                const response = await Api.posts.search(searchQuery);
                setPosts(response);
            } catch (error) {
                console.log(error);
            }
        },
        250,
        [searchQuery],
    );

    const onClickItem = () => {
        setFocused(false);
        setSearchQuery('');
        setPosts([]);
    };

    return (
        <>
            {focused && <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />}

            <div
                ref={ref}
                className={cn('flex rounded-2xl flex-1 justify-between relative h-11 z-30', className)}>
                <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
                <input
                    className="rounded-2xl outline-none w-full bg-gray-100 pl-11"
                    type="text"
                    placeholder="Найти пост..."
                    onFocus={() => setFocused(true)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {posts.length > 0 && (
                    <div
                        className={cn(
                            'absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30',
                            focused && 'visible opacity-100 top-12',
                        )}>
                        {
                        posts.map((post) => (
                            <Link
                                onClick={onClickItem}
                                key={post.post_id}
                                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10"
                                href={`/post/${post.post_id}`}>
                                <span>{post.post_title}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
