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
    params.append("category", category);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?${params.toString()}`
  );
  const { data } = await response.json();
  return data;
};

// 收藏/取消收藏
export const favoriteArticle = async (articleId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/favorite`
  );
  const data = await response.json();
  return data;
};

//获取文章tag

export const getArticleTags = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  const { data } = await response.json();
  return data;
};
