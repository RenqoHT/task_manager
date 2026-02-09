import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
    });

    return NextResponse.json(posts);
}