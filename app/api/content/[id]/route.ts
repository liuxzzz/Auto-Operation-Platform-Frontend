import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ContentItem } from "@/types/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 从数据库查找内容
    const content = await prisma.contentItem.findUnique({
      where: { noteId: id },
      include: {
        likes: true,
        collections: true,
      },
    });

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // 转换为前端期望的格式
    const formattedContent: ContentItem = {
      note_id: content.noteId,
      type: content.type,
      title: content.title,
      desc: content.desc,
      video_url: content.videoUrl || undefined,
      time: Number(content.time),
      last_update_time: Number(content.lastUpdateTime),
      user_id: content.userId,
      nickname: content.nickname,
      avatar: content.avatar,
      liked_count: content.likedCount,
      collected_count: content.collectedCount,
      comment_count: content.commentCount,
      share_count: content.shareCount,
      ip_location: content.ipLocation,
      image_list: content.imageList,
      tag_list: content.tagList,
      last_modify_ts: Number(content.lastModifyTs),
      note_url: content.noteUrl,
      source_keyword: content.sourceKeyword,
      xsec_token: content.xsecToken,
    };

    return NextResponse.json({
      success: true,
      data: formattedContent,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查内容是否存在
    const existingContent = await prisma.contentItem.findUnique({
      where: { noteId: id },
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    const currentTime = BigInt(Date.now());

    // 更新内容
    const updatedContent = await prisma.contentItem.update({
      where: { noteId: id },
      data: {
        title: body.title || existingContent.title,
        desc: body.desc || existingContent.desc,
        type: body.type || existingContent.type,
        videoUrl: body.video_url || existingContent.videoUrl,
        nickname: body.nickname || existingContent.nickname,
        avatar: body.avatar || existingContent.avatar,
        ipLocation: body.ip_location || existingContent.ipLocation,
        imageList: body.image_list || existingContent.imageList,
        tagList: body.tag_list || existingContent.tagList,
        sourceKeyword: body.source_keyword || existingContent.sourceKeyword,
        lastUpdateTime: currentTime,
        lastModifyTs: currentTime,
      },
    });

    // 转换为前端期望的格式
    const formattedContent: ContentItem = {
      note_id: updatedContent.noteId,
      type: updatedContent.type,
      title: updatedContent.title,
      desc: updatedContent.desc,
      video_url: updatedContent.videoUrl || undefined,
      time: Number(updatedContent.time),
      last_update_time: Number(updatedContent.lastUpdateTime),
      user_id: updatedContent.userId,
      nickname: updatedContent.nickname,
      avatar: updatedContent.avatar,
      liked_count: updatedContent.likedCount,
      collected_count: updatedContent.collectedCount,
      comment_count: updatedContent.commentCount,
      share_count: updatedContent.shareCount,
      ip_location: updatedContent.ipLocation,
      image_list: updatedContent.imageList,
      tag_list: updatedContent.tagList,
      last_modify_ts: Number(updatedContent.lastModifyTs),
      note_url: updatedContent.noteUrl,
      source_keyword: updatedContent.sourceKeyword,
      xsec_token: updatedContent.xsecToken,
    };

    return NextResponse.json({
      success: true,
      data: formattedContent,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查内容是否存在
    const existingContent = await prisma.contentItem.findUnique({
      where: { noteId: id },
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // 删除内容（级联删除相关的点赞和收藏）
    const deletedContent = await prisma.contentItem.delete({
      where: { noteId: id },
      include: {
        likes: true,
        collections: true,
      },
    });

    // 转换为前端期望的格式
    const formattedContent: ContentItem = {
      note_id: deletedContent.noteId,
      type: deletedContent.type,
      title: deletedContent.title,
      desc: deletedContent.desc,
      video_url: deletedContent.videoUrl || undefined,
      time: Number(deletedContent.time),
      last_update_time: Number(deletedContent.lastUpdateTime),
      user_id: deletedContent.userId,
      nickname: deletedContent.nickname,
      avatar: deletedContent.avatar,
      liked_count: deletedContent.likedCount,
      collected_count: deletedContent.collectedCount,
      comment_count: deletedContent.commentCount,
      share_count: deletedContent.shareCount,
      ip_location: deletedContent.ipLocation,
      image_list: deletedContent.imageList,
      tag_list: deletedContent.tagList,
      last_modify_ts: Number(deletedContent.lastModifyTs),
      note_url: deletedContent.noteUrl,
      source_keyword: deletedContent.sourceKeyword,
      xsec_token: deletedContent.xsecToken,
    };

    return NextResponse.json({
      success: true,
      data: formattedContent,
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
