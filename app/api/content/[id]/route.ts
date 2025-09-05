import { NextRequest, NextResponse } from "next/server";

import { ContentItem } from "@/types/content";

// 模拟数据存储（实际项目中应该使用数据库）
const contentData: ContentItem[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 模拟从数据库查找内容
    const content = contentData.find(item => item.note_id === id);

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 查找内容索引
    const contentIndex = contentData.findIndex(item => item.note_id === id);

    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // 更新内容
    contentData[contentIndex] = {
      ...contentData[contentIndex],
      ...body,
      last_update_time: Date.now(),
      last_modify_ts: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: contentData[contentIndex],
      message: "Content updated successfully",
    });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 查找内容索引
    const contentIndex = contentData.findIndex(item => item.note_id === id);

    if (contentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // 删除内容
    const deletedContent = contentData.splice(contentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedContent,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
