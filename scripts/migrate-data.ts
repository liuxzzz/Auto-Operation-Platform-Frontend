import fs from "fs";
import path from "path";

import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

interface JSONContentItem {
  note_id: string;
  type: string;
  title: string;
  desc: string;
  video_url?: string;
  time: number;
  last_update_time: number;
  user_id: string;
  nickname: string;
  avatar: string;
  liked_count: string;
  collected_count: string;
  comment_count: string;
  share_count: string;
  ip_location: string;
  image_list: string;
  tag_list: string;
  last_modify_ts: number;
  note_url: string;
  source_keyword: string;
  xsec_token: string;
}

async function migrateData() {
  console.log("🚀 开始数据迁移...");

  try {
    // JSON 数据文件路径
    const dataFiles = [
      "data/search_contents_2025-09-04-舒服干净穿搭.json",
      "data/search_contents_2025-09-04-早秋的穿搭.json",
      "data/search_contents_2025-09-04-卫衣.json",
    ];

    let totalItems = 0;
    let migratedItems = 0;
    let skippedItems = 0;

    for (const filePath of dataFiles) {
      const fullPath = path.join(process.cwd(), filePath);

      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        continue;
      }

      console.log(`📁 处理文件: ${filePath}`);

      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const jsonData: JSONContentItem[] = JSON.parse(fileContent);

      totalItems += jsonData.length;

      for (const item of jsonData) {
        try {
          // 检查是否已存在
          const existing = await prisma.contentItem.findUnique({
            where: { noteId: item.note_id },
          });

          if (existing) {
            console.log(`⏭️  跳过已存在的内容: ${item.note_id}`);
            skippedItems++;
            continue;
          }

          // 插入新内容
          await prisma.contentItem.create({
            data: {
              noteId: item.note_id,
              type: item.type,
              title: item.title,
              desc: item.desc,
              videoUrl: item.video_url,
              time: BigInt(item.time),
              lastUpdateTime: BigInt(item.last_update_time),
              lastModifyTs: BigInt(item.last_modify_ts),
              userId: item.user_id,
              nickname: item.nickname,
              avatar: item.avatar,
              likedCount: item.liked_count,
              collectedCount: item.collected_count,
              commentCount: item.comment_count,
              shareCount: item.share_count,
              ipLocation: item.ip_location,
              imageList: item.image_list,
              tagList: item.tag_list,
              noteUrl: item.note_url,
              sourceKeyword: item.source_keyword,
              xsecToken: item.xsec_token,
            },
          });

          migratedItems++;
          console.log(`✅ 成功迁移: ${item.title} (${item.note_id})`);
        } catch (error) {
          console.error(`❌ 迁移失败: ${item.note_id}`, error);
        }
      }
    }

    console.log("\n📊 迁移统计:");
    console.log(`   总数据量: ${totalItems}`);
    console.log(`   成功迁移: ${migratedItems}`);
    console.log(`   跳过重复: ${skippedItems}`);
    console.log(`   失败数量: ${totalItems - migratedItems - skippedItems}`);

    console.log("\n🎉 数据迁移完成!");
  } catch (error) {
    console.error("❌ 数据迁移失败:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
if (require.main === module) {
  migrateData();
}

export { migrateData };
