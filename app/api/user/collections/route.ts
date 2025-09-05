import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // 从数据库获取用户收藏的内容ID列表
    const collections = await prisma.userCollection.findMany({
      where: { userId },
      select: { noteId: true },
    });

    const collectedNoteIds = collections.map(collection => collection.noteId);

    return NextResponse.json({
      success: true,
      data: collectedNoteIds,
    });
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, noteId, action } = body;

    if (!userId || !noteId) {
      return NextResponse.json(
        { success: false, error: "User ID and Note ID are required" },
        { status: 400 }
      );
    }

    // 检查内容是否存在
    const contentExists = await prisma.contentItem.findUnique({
      where: { noteId },
    });

    if (!contentExists) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    if (action === "collect") {
      // 使用 upsert 避免重复收藏
      await prisma.userCollection.upsert({
        where: {
          userId_noteId: {
            userId,
            noteId,
          },
        },
        update: {}, // 如果已存在，不做任何更新
        create: {
          userId,
          noteId,
        },
      });
    } else if (action === "uncollect") {
      // 删除收藏记录
      await prisma.userCollection.deleteMany({
        where: {
          userId,
          noteId,
        },
      });
    }

    // 获取更新后的用户收藏列表
    const updatedCollections = await prisma.userCollection.findMany({
      where: { userId },
      select: { noteId: true },
    });

    const collectedNoteIds = updatedCollections.map(
      collection => collection.noteId
    );

    return NextResponse.json({
      success: true,
      data: {
        userId,
        noteId,
        action,
        collections: collectedNoteIds,
      },
      message: `Content ${action}ed successfully`,
    });
  } catch (error) {
    console.error("Error updating user collections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user collections" },
      { status: 500 }
    );
  }
}
