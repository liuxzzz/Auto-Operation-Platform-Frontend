//获取文章
export const getArticles = async (
  page: number = 1,
  limit: number = 12,
  category?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category && category !== "全部") {
    params.append("source_keyword", category);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?${params.toString()}`
  );
  const { data } = await response.json();
  return data;
};

// 获取用户收藏列表
export const getUserFavorites = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?is_favorited=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("获取收藏列表失败");
  }

  const { data } = await response.json();
  return data;
};

// 收藏/取消收藏
export const favoriteArticle = async (
  articleId: string,
  is_favorited: boolean
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/favorite/${articleId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_favorited: is_favorited,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("操作失败");
  }

  const data = await response.json();
  return data;
};

//获取文章tag

export const getArticleTags = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  const { data } = await response.json();
  return data;
};
