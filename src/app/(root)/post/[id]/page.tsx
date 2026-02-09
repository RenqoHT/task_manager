import { Container } from "@/components/shared";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {

    const { id } = await params;
    const post = await prisma.post.findFirst({ where: { post_id: Number(id) } });

    if (!post) {
        return notFound();
    }

    return (
        <Container className="flex flex-col my-10">
            <p>{post.post_description}</p>
        </Container>
    );
}