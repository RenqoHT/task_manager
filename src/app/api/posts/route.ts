import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Helper function to build where clause based on user roles
function buildPostsWhereClause(userRoles: {
  admin_role?: boolean | null;
  coordinator_role?: boolean | null;
  photographer_role?: boolean | null;
  designer_role?: boolean | null;
  SMM_role?: boolean | null;
}, searchQuery?: string) {
  const conditions: any[] = [];

  // Admin and Coordinator see all posts
  if (userRoles.admin_role || userRoles.coordinator_role) {
    // No additional filtering needed
  } else {
    const roleConditions: any[] = [];

    if (userRoles.photographer_role) {
      roleConditions.push({ post_needs_photogallery: true });
      roleConditions.push({ post_needs_video: true });
    }

    if (userRoles.designer_role) {
      roleConditions.push({ post_needs_cover_photo: true });
      roleConditions.push({ post_needs_photo_cards: true });
    }

    if (userRoles.SMM_role) {
      roleConditions.push({ post_needs_mini_video_smm: true });
      roleConditions.push({ post_needs_mini_gallery: true });
    }

    if (roleConditions.length > 0) {
      conditions.push({ OR: roleConditions });
    } else {
      return null;
    }
  }

  if (searchQuery) {
    conditions.push({
      post_title: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    });
  }

  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { AND: conditions };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filterByRole = req.nextUrl.searchParams.get('filterByRole') === 'true';
    const searchQuery = req.nextUrl.searchParams.get('query') || undefined;

    let whereClause: any = {};

    if (filterByRole) {
      const userRoles = {
        admin_role: session.user.admin_role,
        coordinator_role: session.user.coordinator_role,
        photographer_role: session.user.photographer_role,
        designer_role: session.user.designer_role,
        SMM_role: session.user.SMM_role,
      };

      const roleWhereClause = buildPostsWhereClause(userRoles, searchQuery);

      if (roleWhereClause === null) {
        return NextResponse.json([]);
      }

      whereClause = roleWhereClause;
    } else if (searchQuery) {
      whereClause = {
        post_title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: {
        post_date: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
