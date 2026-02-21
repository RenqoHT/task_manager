import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/generated/prisma/client";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const existingPost = await prisma.post.findUnique({
            where: { post_id: Number(id) },
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: "Пост не найден" },
                { status: 404 }
            );
        }

        const updatedPost = await prisma.post.update({
            where: { post_id: Number(id) },
            data: {
                post_title: body.post_title,
                post_description: body.post_description,
                post_needs_video_smm: body.post_needs_video_smm,
                post_needs_video_maker: body.post_needs_video_maker,
                post_needs_text: body.post_needs_text,
                post_needs_photogallery: body.post_needs_photogallery,
                post_needs_cover_photo: body.post_needs_cover_photo,
                post_needs_photo_cards: body.post_needs_photo_cards,
                post_done_link_video_smm: body.post_done_link_video_smm,
                post_done_link_video_maker: body.post_done_link_video_maker,
                post_done_link_text: body.post_done_link_text,
                post_done_link_photogallery: body.post_done_link_photogallery,
                post_done_link_cover_photo: body.post_done_link_cover_photo,
                post_done_link_photo_cards: body.post_done_link_photo_cards,
                responsible_person_id: body.responsible_person_id,
                post_deadline: body.post_deadline ? new Date(String(body.post_deadline)) : undefined,
                post_type: body.post_type,
            },
        });

        return NextResponse.json(updatedPost);
    } catch (error: any) {
        console.error("Ошибка при обновлении поста:", error);
        
        return NextResponse.json(
            { 
                error: "Внутренняя ошибка сервера при обновлении поста",
                details: error.message || error.toString()
            },
            { status: 500 }
        );
    }
}