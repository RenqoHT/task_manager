import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tags - Get all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Ошибка при получении тегов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при получении тегов" },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.color) {
      return NextResponse.json(
        { error: "Название и цвет тега обязательны" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name: body.name }
    });

    if (existingTag) {
      return NextResponse.json(existingTag);
    }

    const newTag = await prisma.tag.create({
      data: {
        name: body.name,
        color: body.color
      }
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании тега:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера при создании тега" },
      { status: 500 }
    );
  }
}
