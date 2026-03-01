import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { checkUserPermissions } from "@/lib/permissions";
import { getRandomColor, getColorFromString } from "@/lib/tag-colors";

const TASK_FIELDS = [
  { need: 'post_needs_mini_video_smm', link: 'post_done_link_mini_video_smm' },
  { need: 'post_needs_video', link: 'post_done_link_video' },
  { need: 'post_needs_text', link: 'post_done_link_text' },
  { need: 'post_needs_photogallery', link: 'post_done_link_photogallery' },
  { need: 'post_needs_cover_photo', link: 'post_done_link_cover_photo' },
  { need: 'post_needs_photo_cards', link: 'post_done_link_photo_cards' },
  { need: 'post_needs_mini_gallery', link: 'post_done_link_mini_gallery' },
] as const;

const isValidLink = (value: unknown): boolean => 
  value !== null && value !== undefined && String(value).trim() !== '';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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

    if (!permissions.canEditPost) {
      return NextResponse.json(
        { error: "У вас нет прав для редактирования постов" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const existingPost = await prisma.post.findUnique({
      where: { post_id: Number(id) },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Пост не найден" }, { status: 404 });
    }

    // Функция получения значения: из тела запроса, иначе из базы
    const get = (field: string) => 
      body[field] !== undefined ? body[field] : (existingPost as any)[field];

    // Обработка задач и расчет статуса
    const { taskUpdates, hasNeeds, allTasksComplete } = TASK_FIELDS.reduce((acc, { need, link }) => {
      const needValue = get(need);
      const linkValue = get(link);

      acc.taskUpdates[need] = needValue;
      acc.taskUpdates[link] = linkValue;

      if (needValue) {
        acc.hasNeeds = true;
        if (!isValidLink(linkValue)) {
          acc.allTasksComplete = false;
        }
      }
      
      return acc;
    }, { 
      taskUpdates: {} as Record<string, any>, 
      hasNeeds: false, 
      allTasksComplete: true 
    });

    const updateData: any = {
      post_title: get('post_title'),
      post_description: get('post_description'),
      responsible_person_id: get('responsible_person_id'),
      feedback_comment: get('feedback_comment'),
      tz_link: get('tz_link'),
      post_deadline: body.post_deadline !== undefined 
        ? new Date(String(body.post_deadline)) 
        : existingPost.post_deadline,
      
      post_status: hasNeeds && allTasksComplete ? "Готово" : "В работе",
      
      ...taskUpdates,
    };

    // Handle tags update
    if (body.tags !== undefined) {
      // Delete existing tags
      await prisma.postTag.deleteMany({
        where: { post_id: Number(id) }
      });

      // Process and create new tags in order
      const tagRelations: { tag_id: number }[] = [];
      if (Array.isArray(body.tags) && body.tags.length > 0) {
        for (const tag of body.tags) {
          let tagId: number | null = null;

          if (tag.tag_id && tag.tag_id !== 0) {
            // Existing tag
            tagId = tag.tag_id;
          } else if (tag.name) {
            // New tag - create it
            const existingTag = await prisma.tag.findUnique({
              where: { name: tag.name }
            });

            if (existingTag) {
              tagId = existingTag.tag_id;
            } else {
              // Use deterministic color based on tag name for consistency with frontend
              const tagColor = tag.color || getColorFromString(tag.name) || getRandomColor();
              const newTag = await prisma.tag.create({
                data: {
                  name: tag.name,
                  color: tagColor
                }
              });
              tagId = newTag.tag_id;
            }
          }

          if (tagId) {
            tagRelations.push({ tag_id: tagId });
          }
        }
      }

      // Create new post-tag relationships one by one to maintain order
      for (const relation of tagRelations) {
        await prisma.postTag.create({
          data: {
            post_id: Number(id),
            tag_id: relation.tag_id
          }
        });
      }
    }

    const updatedPost = await prisma.post.update({
      where: { post_id: Number(id) },
      data: updateData,
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

    return NextResponse.json(updatedPost);

  } catch (error: any) {
    console.error("Ошибка при обновлении поста:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера", details: error.message },
      { status: 500 }
    );
  }
}
