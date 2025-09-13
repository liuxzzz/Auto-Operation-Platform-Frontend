export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};
