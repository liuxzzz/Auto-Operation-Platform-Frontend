/**
 * 处理图片列表，提取第一张图片
 * @param imageList 图片列表字符串，可能包含多个用逗号分隔的图片URL
 * @returns 第一张图片的URL
 */
export const getFirstImage = (imageList: string): string => {
  if (!imageList || typeof imageList !== "string") {
    return "";
  }

  // 分割图片列表，取第一张图片
  const images = imageList
    .split(",")
    .map((img) => img.trim())
    .filter((img) => img);
  return images.length > 0 ? images[0] : "";
};

/**
 * 获取图片列表中的所有图片URL
 * @param imageList 图片列表字符串，可能包含多个用逗号分隔的图片URL
 * @returns 图片URL数组
 */
export const getAllImages = (imageList: string): string[] => {
  if (!imageList || typeof imageList !== "string") {
    return [];
  }

  return imageList
    .split(",")
    .map((img) => img.trim())
    .filter((img) => img);
};
