import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Проверка ролей: только admin или SMM могут удалять посты
    const canDelete = session.user.admin_role === true || session.user.SMM_role === true;
    
    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { post_id: Number(id) },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Пост не найден" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { post_id: Number(id) },
    });

    return NextResponse.json({ message: "Пост успешно удален" });

  } catch (error: any) {
    console.error("Ошибка при удалении поста:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера", details: error.message },
      { status: 500 }
    );
  }
}
