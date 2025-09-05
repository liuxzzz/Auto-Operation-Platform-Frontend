import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ContentItem } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where =
      category && category !== "全部" ? { sourceKeyword: category } : {};

    // 获取总数
    const total = await prisma.contentItem.count({ where });

    // 获取分页数据
    const content = await prisma.contentItem.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        likes: true,
        collections: true,
      },
    });

    // 转换为前端期望的格式
    const formattedData: ContentItem[] = content.map(item => ({
      note_id: item.noteId,
      type: item.type,
      title: item.title,
      desc: item.desc,
      video_url: item.videoUrl || undefined,
      time: Number(item.time),
      last_update_time: Number(item.lastUpdateTime),
      user_id: item.userId,
      nickname: item.nickname,
      avatar: item.avatar,
      liked_count: item.likedCount,
      collected_count: item.collectedCount,
      comment_count: item.commentCount,
      share_count: item.shareCount,
      ip_location: item.ipLocation,
      image_list: item.imageList,
      tag_list: item.tagList,
      last_modify_ts: Number(item.lastModifyTs),
      note_url: item.noteUrl,
      source_keyword: item.sourceKeyword,
      xsec_token: item.xsecToken,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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

    const currentTime = BigInt(Date.now());
    const noteId = `note_${Date.now()}`;

    // 创建新内容
    const newContent = await prisma.contentItem.create({
      data: {
        noteId,
        type: body.type || "normal",
        title: body.title,
        desc: body.desc,
        videoUrl: body.video_url,
        time: currentTime,
        lastUpdateTime: currentTime,
        lastModifyTs: currentTime,
        userId: body.user_id || "user_1",
        nickname: body.nickname || "用户",
        avatar: body.avatar || "/default-avatar.png",
        likedCount: "0",
        collectedCount: "0",
        commentCount: "0",
        shareCount: "0",
        ipLocation: body.ip_location || "未知",
        imageList: body.image_list || "",
        tagList: body.tag_list || "",
        noteUrl:
          body.note_url || `https://www.xiaohongshu.com/explore/${Date.now()}`,
        sourceKeyword: body.source_keyword || "默认分类",
        xsecToken: body.xsec_token || "",
      },
    });

    // 转换为前端期望的格式
    const formattedContent: ContentItem = {
      note_id: newContent.noteId,
      type: newContent.type,
      title: newContent.title,
      desc: newContent.desc,
      video_url: newContent.videoUrl || undefined,
      time: Number(newContent.time),
      last_update_time: Number(newContent.lastUpdateTime),
      user_id: newContent.userId,
      nickname: newContent.nickname,
      avatar: newContent.avatar,
      liked_count: newContent.likedCount,
      collected_count: newContent.collectedCount,
      comment_count: newContent.commentCount,
      share_count: newContent.shareCount,
      ip_location: newContent.ipLocation,
      image_list: newContent.imageList,
      tag_list: newContent.tagList,
      last_modify_ts: Number(newContent.lastModifyTs),
      note_url: newContent.noteUrl,
      source_keyword: newContent.sourceKeyword,
      xsec_token: newContent.xsecToken,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedContent,
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
