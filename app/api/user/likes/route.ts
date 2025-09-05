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

    // 从数据库获取用户点赞的内容ID列表
    const likes = await prisma.userLike.findMany({
      where: { userId },
      select: { noteId: true },
    });

    const likedNoteIds = likes.map(like => like.noteId);

    return NextResponse.json({
      success: true,
      data: likedNoteIds,
    });
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user likes" },
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

    if (action === "like") {
      // 使用 upsert 避免重复点赞
      await prisma.userLike.upsert({
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
    } else if (action === "unlike") {
      // 删除点赞记录
      await prisma.userLike.deleteMany({
        where: {
          userId,
          noteId,
        },
      });
    }

    // 获取更新后的用户点赞列表
    const updatedLikes = await prisma.userLike.findMany({
      where: { userId },
      select: { noteId: true },
    });

    const likedNoteIds = updatedLikes.map(like => like.noteId);

    return NextResponse.json({
      success: true,
      data: {
        userId,
        noteId,
        action,
        likes: likedNoteIds,
      },
      message: `Content ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error updating user likes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user likes" },
      { status: 500 }
    );
  }
}
