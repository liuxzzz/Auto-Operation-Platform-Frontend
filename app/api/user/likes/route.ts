import { NextRequest, NextResponse } from "next/server";

// 模拟用户点赞数据存储
const userLikes: Record<string, Set<string>> = {};

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

    const likes = userLikes[userId] || new Set();

    return NextResponse.json({
      success: true,
      data: Array.from(likes),
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

    // 初始化用户点赞集合
    if (!userLikes[userId]) {
      userLikes[userId] = new Set();
    }

    if (action === "like") {
      userLikes[userId].add(noteId);
    } else if (action === "unlike") {
      userLikes[userId].delete(noteId);
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        noteId,
        action,
        likes: Array.from(userLikes[userId]),
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
