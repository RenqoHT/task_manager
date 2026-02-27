import { Container, HomeContent, TopBar, AddPostButton } from "@/components/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

function buildPostsWhereClause(userRoles: {
  admin_role?: boolean | null;
  coordinator_role?: boolean | null;
  photographer_role?: boolean | null;
  designer_role?: boolean | null;
  SMM_role?: boolean | null;
}) {
  const conditions: any[] = [];

  if (userRoles.photographer_role === true) {
    conditions.push({ post_needs_photogallery: true });
    conditions.push({ post_needs_video: true });
  }

  if (userRoles.designer_role === true) {
    conditions.push({ post_needs_cover_photo: true });
    conditions.push({ post_needs_photo_cards: true });
  }

  if (userRoles.SMM_role === true) {
    conditions.push({ post_needs_mini_video_smm: true });
    conditions.push({ post_needs_mini_gallery: true });
  }

  if (conditions.length > 0) {
    return { OR: conditions };
  }

  if (userRoles.admin_role === true || userRoles.coordinator_role === true) {
    return {};
  }

  return { post_id: -1 };
}

interface HomeProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const session = await getServerSession(authOptions);
    
    const params = await searchParams;
    
    const filterByRole = params?.filterByRole === 'true';
    
    let posts: any[] = [];
    
    if (session?.user) {
        const userRoles = {
            admin_role: session.user.admin_role ?? false,
            coordinator_role: session.user.coordinator_role ?? false,
            photographer_role: session.user.photographer_role ?? false,
            designer_role: session.user.designer_role ?? false,
            SMM_role: session.user.SMM_role ?? false,
        };
        
        let whereClause: any = {};
        
        if (filterByRole) {
            whereClause = buildPostsWhereClause(userRoles);
        }
        
        posts = await prisma.post.findMany({
            where: whereClause,
            orderBy: {
                post_date: 'desc',
            },
        });
    } else {
        posts = await prisma.post.findMany({
            orderBy: {
                post_date: 'desc',
            },
        });
    }

    return (
        <>
            <TopBar/>

            <Container className="mt-5 mb-5">
                <HomeContent posts={posts} />
                <AddPostButton />
            </Container>
        </>
    );
}
