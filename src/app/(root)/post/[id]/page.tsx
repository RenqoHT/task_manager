import { ChoosePostForm, Container } from "@/components/shared";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function PostPage({ params }: { params: { id: string } }) {

    const { id } = await params;
    
    const session = await getServerSession(authOptions);
    const canDelete = session?.user?.admin_role === true || session?.user?.SMM_role === true;
    
    const post = await prisma.post.findFirst({ 
        where: { post_id: Number(id) },
        include: {
            user: true
        }
    });

    if (!post) {
        return notFound();
    }

    return (
        <Container className="flex flex-col my-10">
            <ChoosePostForm post={post} canDelete={canDelete} />
        </Container>
    );
}
