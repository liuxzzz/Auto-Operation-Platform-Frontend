// 账号管理
import { Account } from "@/lib/types";

export const getAccounts = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export const updateAccount = async (account: Account) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${account.id}`,
    {
      method: "PUT",
      body: JSON.stringify(account),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export const deleteAccount = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${id}`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};
