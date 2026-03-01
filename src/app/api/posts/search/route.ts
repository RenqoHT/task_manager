import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query') || '';

    const posts = await prisma.post.findMany({
        where: {
            post_title: {
                contains: query,
                mode: 'insensitive',
            },
        },
        take: 5,
        include: {
            tags: {
                include: {
                    tag: true
                },
                orderBy: {
                    post_tag_id: 'asc'
                }
            },
            user: {
                select: {
                    user_id: true,
                    user_login: true
                }
            }
        }
    });

    return NextResponse.json(posts);
}