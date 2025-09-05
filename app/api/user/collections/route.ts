import { NextRequest, NextResponse } from "next/server";

// 模拟用户收藏数据存储
const userCollections: Record<string, Set<string>> = {};

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

    const collections = userCollections[userId] || new Set();

    return NextResponse.json({
      success: true,
      data: Array.from(collections),
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

    // 初始化用户收藏集合
    if (!userCollections[userId]) {
      userCollections[userId] = new Set();
    }

    if (action === "collect") {
      userCollections[userId].add(noteId);
    } else if (action === "uncollect") {
      userCollections[userId].delete(noteId);
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        noteId,
        action,
        collections: Array.from(userCollections[userId]),
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
