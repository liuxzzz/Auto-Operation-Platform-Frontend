import { NextRequest, NextResponse } from "next/server";

import { ContentItem } from "@/types/content";

// 模拟数据存储（实际项目中应该使用数据库）
const contentData: ContentItem[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // 模拟从数据库获取数据
    let filteredData = contentData;

    // 按分类筛选
    if (category && category !== "全部") {
      filteredData = contentData.filter(
        item => item.source_keyword === category
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基本验证
    if (!body.title || !body.desc) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    // 创建新内容
    const newContent: ContentItem = {
      note_id: `note_${Date.now()}`,
      type: body.type || "normal",
      title: body.title,
      desc: body.desc,
      video_url: body.video_url,
      time: Date.now(),
      last_update_time: Date.now(),
      user_id: body.user_id || "user_1",
      nickname: body.nickname || "用户",
      avatar: body.avatar || "/default-avatar.png",
      liked_count: "0",
      collected_count: "0",
      comment_count: "0",
      share_count: "0",
      ip_location: body.ip_location || "未知",
      image_list: body.image_list || "",
      tag_list: body.tag_list || "",
      last_modify_ts: Date.now(),
      note_url:
        body.note_url || `https://www.xiaohongshu.com/explore/${Date.now()}`,
      source_keyword: body.source_keyword || "默认分类",
      xsec_token: body.xsec_token || "",
    };

    // 添加到数据存储
    contentData.push(newContent);

    return NextResponse.json(
      {
        success: true,
        data: newContent,
        message: "Content created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 }
    );
  }
}
