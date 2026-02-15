import { Container, PostGroupList, TopBar, AddPostButton } from "@/components/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

// Helper function to build where clause based on user roles
function buildPostsWhereClause(userRoles: {
  admin_role?: boolean | null;
  coordinator_role?: boolean | null;
  videomaker_role?: boolean | null;
  photographer_role?: boolean | null;
  designer_role?: boolean | null;
  SMM_role?: boolean | null;
}) {
  // Build flat OR conditions for specific content roles (priority over admin/coordinator)
  const conditions: any[] = [];

  if (userRoles.videomaker_role) {
    conditions.push({ post_needs_video_maker: true });
  }

  if (userRoles.photographer_role) {
    conditions.push({ post_needs_photogallery: true });
  }

  if (userRoles.designer_role) {
    conditions.push({ post_needs_cover_photo: true });
    conditions.push({ post_needs_photo_cards: true });
  }

  if (userRoles.SMM_role) {
    conditions.push({ post_needs_video_smm: true });
    conditions.push({ post_needs_text: true });
  }

  // If user has any specific content role conditions, return them in a flat OR
  // This takes priority over admin/coordinator when filterByRole is enabled
  if (conditions.length > 0) {
    return { OR: conditions };
  }

  // User has no specific content roles - check if admin/coordinator
  if (userRoles.admin_role || userRoles.coordinator_role) {
    return {}; // Admin/Coordinator see all posts
  }

  // User has no roles that allow viewing posts
  return { post_id: -1 }; // Return impossible condition to show no posts
}

interface HomeProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const session = await getServerSession(authOptions);
    
    // Unwrap searchParams Promise (Next.js 15+ requirement)
    const params = await searchParams;
    
    // Check if filter by role is enabled (default: false - show all posts)
    const filterByRole = params?.filterByRole === 'true';
    
    let posts: any[] = [];
    
    if (session?.user) {
        let whereClause: any = {};
        
        // Apply role-based filtering only if filterByRole is true
        if (filterByRole) {
            const userRoles = {
                admin_role: session.user.admin_role,
                coordinator_role: session.user.coordinator_role,
                videomaker_role: session.user.videomaker_role,
                photographer_role: session.user.photographer_role,
                designer_role: session.user.designer_role,
                SMM_role: session.user.SMM_role,
            };
            
            console.log('User roles from session:', userRoles);
            whereClause = buildPostsWhereClause(userRoles);
            console.log('Built where clause:', JSON.stringify(whereClause, null, 2));
        }
        
        // If whereClause is null, user has no permissions - show empty array
        if (whereClause !== null) {
            posts = await prisma.post.findMany({
                where: whereClause,
                orderBy: {
                    post_date: 'desc',
                },
            });
        }
    } else {
        // For non-authenticated users, show all posts
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
                {/* Посты */}
                <PostGroupList items={posts}/>
                <AddPostButton />
            </Container>

            {/* <div style={{height: 3000}}/> */}
        </>
    );
}
