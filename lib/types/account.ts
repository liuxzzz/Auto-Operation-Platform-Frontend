export interface CreateAccountRequest {
  platform: string;
  account_name: string;
}

export interface Account {
  id: string;
  platform: string;
  account_name: string;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}
