import { ChoosePostModal, Container } from "@/components/shared";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function PostModalPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
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

    const canDelete = session?.user?.admin_role === true || session?.user?.SMM_role === true;

    return <ChoosePostModal post={post} canDelete={canDelete} />;
}
