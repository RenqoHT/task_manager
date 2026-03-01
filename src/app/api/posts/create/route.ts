import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { checkUserPermissions } from "@/lib/permissions";
import { getRandomColor, getColorFromString } from "@/lib/tag-colors";

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

        // Handle tags - create new ones if needed
        const tagIds: number[] = [];
        if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
            for (const tag of body.tags) {
                if (tag.tag_id) {
                    // Existing tag
                    tagIds.push(tag.tag_id);
                } else if (tag.name) {
                    // New tag - create it
                    const existingTag = await prisma.tag.findUnique({
                        where: { name: tag.name }
                    });

                    if (existingTag) {
                        tagIds.push(existingTag.tag_id);
                    } else {
                        // Use deterministic color based on tag name for consistency with frontend
                        const tagColor = tag.color || getColorFromString(tag.name) || getRandomColor();
                        const newTag = await prisma.tag.create({
                            data: {
                                name: tag.name,
                                color: tagColor
                            }
                        });
                        tagIds.push(newTag.tag_id);
                    }
                }
            }
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
                tags: tagIds.length > 0 ? {
                    create: tagIds.map(tagId => ({
                        tag: {
                            connect: { tag_id: tagId }
                        }
                    }))
                } : undefined
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    },
                    orderBy: {
                        post_tag_id: 'asc'
                    }
                }
            }
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
