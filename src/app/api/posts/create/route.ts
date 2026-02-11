import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Валидация входных данных
        if (!body.post_title || !body.post_type || !body.post_deadline) {
            return NextResponse.json(
                { error: "Название поста, тип и крайний срок обязательны" },
                { status: 400 }
            );
        }

        // Создание нового поста
        const newPost = await prisma.post.create({
            data: {
                post_title: body.post_title,
                post_description: body.post_description || null,
                post_needs_video_smm: body.post_needs_video_smm || false,
                post_needs_video_maker: body.post_needs_video_maker || false,
                post_needs_text: body.post_needs_text || false,
                post_needs_photogallery: body.post_needs_photogallery || false,
                post_needs_cover_photo: body.post_needs_cover_photo || false,
                post_needs_photo_cards: body.post_needs_photo_cards || false,
                responsible_person_id: body.responsible_person_id || null,
                post_deadline: new Date(body.post_deadline),
                post_type: body.post_type,
                post_status: "В работе", // Установим статус по умолчанию
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Ошибка при создании поста:", error);
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера при создании поста" },
            { status: 500 }
        );
    }
}