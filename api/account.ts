import { CreateAccountRequest } from "@/lib/types";

// 账号管理

export const createAccount = async (account: CreateAccountRequest) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/create`,
    {
      method: "POST",
      body: JSON.stringify(account),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
};
