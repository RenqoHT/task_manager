import { ChoosePostModal, Container } from "@/components/shared";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostModalPage({ params }: { params: { id: string } }) {

    const { id } = await params;
    const post = await prisma.post.findFirst({ 
        where: { post_id: Number(id) },
        include: {
            user: true
        }
    });

    if (!post) {
        return notFound();
    }

    return <ChoosePostModal post={post} />;
}