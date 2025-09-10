export const generateContent = async ({
  model,
  content,
}: {
  model: string;
  content: { expression: string; title: string };
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-docs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        content,
      }),
    }
  );
  const { data } = await response.json();
  return data;
};
