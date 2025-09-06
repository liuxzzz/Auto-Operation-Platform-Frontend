import { useCallback, useEffect, useState } from "react";

import { ContentItem } from "@/lib/types";

// 静态演示数据
const DEMO_CONTENT: ContentItem[] = [
  {
    note_id: "demo-1",
    type: "image",
    title: "秋日穿搭分享 🍂",
    desc: "今天想和大家分享一套超级温柔的秋日穿搭！这件卡其色风衣真的太好看了，搭配白色内搭和牛仔裤，简约又时尚。整体色调很温暖，非常适合秋天的氛围感～",
    video_url: null,
    time: Date.now() - 86400000,
    last_update_time: Date.now(),
    last_modify_ts: Date.now(),
    user_id: "user-1",
    nickname: "时尚小仙女",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1d5?w=100&h=100&fit=crop&crop=face",
    liked_count: "1.2k",
    collected_count: "856",
    comment_count: "89",
    share_count: "23",
    ip_location: "上海",
    image_list:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
    tag_list: "穿搭,秋装,时尚",
    note_url: "#demo-1",
    source_keyword: "早秋的穿搭",
    xsec_token: "demo-token-1",
  },
  {
    note_id: "demo-2",
    type: "image",
    title: "超舒服的居家穿搭 ✨",
    desc: "分享一套超级舒服的居家穿搭！这件米色卫衣质感真的绝了，面料超级软糯，搭配同色系的休闲裤，整体看起来很干净很舒适。在家工作或者休息都很适合～",
    video_url: null,
    time: Date.now() - 172800000,
    last_update_time: Date.now(),
    last_modify_ts: Date.now(),
    user_id: "user-2",
    nickname: "简约生活家",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    liked_count: "856",
    collected_count: "423",
    comment_count: "67",
    share_count: "12",
    ip_location: "北京",
    image_list:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
    tag_list: "居家,舒适,简约",
    note_url: "#demo-2",
    source_keyword: "舒服干净穿搭",
    xsec_token: "demo-token-2",
  },
  {
    note_id: "demo-3",
    type: "image",
    title: "温暖卫衣搭配指南 🧡",
    desc: "天气转凉了，卫衣绝对是秋冬必备单品！这件橘色卫衣颜色超级温暖，版型也很好看。搭配黑色运动裤和小白鞋，既休闲又有活力。推荐给喜欢运动风的小伙伴们～",
    video_url: null,
    time: Date.now() - 259200000,
    last_update_time: Date.now(),
    last_modify_ts: Date.now(),
    user_id: "user-3",
    nickname: "运动达人",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    liked_count: "2.1k",
    collected_count: "1.3k",
    comment_count: "156",
    share_count: "45",
    ip_location: "深圳",
    image_list:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop",
    tag_list: "卫衣,运动,秋装",
    note_url: "#demo-3",
    source_keyword: "卫衣",
    xsec_token: "demo-token-3",
  },
];

export function useContent() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 加载内容数据（模拟异步加载）
  const loadContent = useCallback(async () => {
    if (initialized) return; // 防止重复加载

    try {
      setLoading(true);
      setError(null);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAllContent(DEMO_CONTENT);
      setFilteredContent(DEMO_CONTENT);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // 按分类筛选内容
  const filterByCategory = useCallback(
    (category: string) => {
      if (category === "全部") {
        setFilteredContent(allContent);
      } else {
        const filtered = allContent.filter(
          item => item.source_keyword === category
        );
        setFilteredContent(filtered);
      }
    },
    [allContent]
  );

  // 获取所有分类
  const getCategories = useCallback(() => {
    const categories = [
      "全部",
      ...new Set(allContent.map(item => item.source_keyword)),
    ];
    return categories;
  }, [allContent]);

  // 创建新内容（模拟）
  const createContent = useCallback(async (data: Partial<ContentItem>) => {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const newContent: ContentItem = {
        note_id: `demo-${Date.now()}`,
        type: "image",
        title: data.title || "新内容",
        desc: data.desc || "这是新创建的内容",
        video_url: data.video_url || null,
        time: Date.now(),
        last_update_time: Date.now(),
        last_modify_ts: Date.now(),
        user_id: "current-user",
        nickname: "当前用户",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        liked_count: "0",
        collected_count: "0",
        comment_count: "0",
        share_count: "0",
        ip_location: "本地",
        image_list:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        tag_list: "新内容",
        note_url: `#${Date.now()}`,
        source_keyword: data.source_keyword || "其他",
        xsec_token: `token-${Date.now()}`,
      };

      setAllContent(prev => [...prev, newContent]);
      setFilteredContent(prev => [...prev, newContent]);
      return newContent;
    } catch (error) {
      console.error("Error creating content:", error);
      return null;
    }
  }, []);

  // 更新内容（模拟）
  const updateContent = useCallback(
    async (id: string, data: Partial<ContentItem>) => {
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedContent = allContent.find(item => item.note_id === id);
        if (updatedContent) {
          const newContent = {
            ...updatedContent,
            ...data,
            last_update_time: Date.now(),
          };
          setAllContent(prev =>
            prev.map(item => (item.note_id === id ? newContent : item))
          );
          setFilteredContent(prev =>
            prev.map(item => (item.note_id === id ? newContent : item))
          );
          return newContent;
        }
        return null;
      } catch (error) {
        console.error("Error updating content:", error);
        return null;
      }
    },
    [allContent]
  );

  // 删除内容（模拟）
  const deleteContent = useCallback(async (id: string) => {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      setAllContent(prev => prev.filter(item => item.note_id !== id));
      setFilteredContent(prev => prev.filter(item => item.note_id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting content:", error);
      return false;
    }
  }, []);

  // 初始化加载 - 只在组件挂载时执行一次
  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    allContent,
    filteredContent,
    loading,
    error,
    loadContent,
    filterByCategory,
    getCategories,
    createContent,
    updateContent,
    deleteContent,
  };
}
