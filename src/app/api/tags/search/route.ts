import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tags/search?query=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: 10
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Ошибка при поиске тегов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при поиске тегов" },
      { status: 500 }
    );
  }
}
