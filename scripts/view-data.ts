import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function viewData() {
  console.log("🔍 查看数据库数据...\n");

  try {
    // 查看内容总数
    const contentCount = await prisma.contentItem.count();
    console.log(`📝 内容总数: ${contentCount}`);

    // 查看最新的 5 条内容
    const latestContent = await prisma.contentItem.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        noteId: true,
        title: true,
        nickname: true,
        sourceKeyword: true,
        createdAt: true,
      },
    });

    console.log("\n📋 最新内容:");
    latestContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   作者: ${item.nickname}`);
      console.log(`   分类: ${item.sourceKeyword}`);
      console.log(`   ID: ${item.noteId}`);
      console.log(`   时间: ${item.createdAt}`);
      console.log("");
    });

    // 查看分类统计
    const categoryStats = await prisma.contentItem.groupBy({
      by: ["sourceKeyword"],
      _count: {
        noteId: true,
      },
      orderBy: {
        _count: {
          noteId: "desc",
        },
      },
    });

    console.log("📊 分类统计:");
    categoryStats.forEach(stat => {
      console.log(`   ${stat.sourceKeyword}: ${stat._count.noteId} 条`);
    });

    // 查看用户交互统计
    const likeCount = await prisma.userLike.count();
    const collectionCount = await prisma.userCollection.count();

    console.log(`\n💖 点赞总数: ${likeCount}`);
    console.log(`⭐ 收藏总数: ${collectionCount}`);
  } catch (error) {
    console.error("❌ 查看数据失败:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行查看
if (require.main === module) {
  viewData();
}

export { viewData };
