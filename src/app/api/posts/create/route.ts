import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { checkUserPermissions } from "@/lib/permissions";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const permissions = checkUserPermissions({
        admin_role: session.user.admin_role,
        SMM_role: session.user.SMM_role,
        designer_role: session.user.designer_role,
        photographer_role: session.user.photographer_role,
        coordinator_role: session.user.coordinator_role,
    });

    if (!permissions.canCreatePost) {
        return NextResponse.json(
            { error: "У вас нет прав для создания постов" },
            { status: 403 }
        );
    }


    try {
        const body = await req.json();

        if (!body.post_title || !body.post_deadline) {
            return NextResponse.json(
                { error: "Название поста и крайний срок обязательны" },
                { status: 400 }
            );
        }

            const newPost = await prisma.post.create({
                data: {
                    post_title: body.post_title,
                    post_description: body.post_description || null,
                    post_needs_mini_video_smm: body.post_needs_mini_video_smm || false,
                    post_needs_video: body.post_needs_video || false,
                    post_needs_text: body.post_needs_text || false,
                    post_needs_photogallery: body.post_needs_photogallery || false,
                    post_needs_cover_photo: body.post_needs_cover_photo || false,
                    post_needs_photo_cards: body.post_needs_photo_cards || false,
                    post_needs_mini_gallery: body.post_needs_mini_gallery || false,
                    tz_link: body.tz_link || null,
                    responsible_person_id: body.responsible_person_id || null,
                    post_deadline: new Date(body.post_deadline),
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
