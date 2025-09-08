export const generateContent = async (
  expression: string,
  description: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-docs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression,
        description,
      }),
    }
  );
  const { data } = await response.json();
  return data;
};
