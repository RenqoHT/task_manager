'use client';

import { PostAdd } from "@/components/shared/modals/post-add";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

export const AddPostButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button 
                variant={"outline"} 
                className="fixed bottom-20 right-20 size-20 rounded-4xl border-6"
                onClick={() => setIsModalOpen(true)}
            >
                <Plus/>
            </Button>

            {/* Модалка добавления поста */}
            <PostAdd 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
            />
        </>
    );
};