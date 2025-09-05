import { API_CONFIG, DEFAULT_HEADERS } from "@/lib/constants/api";

// HTTP 请求配置
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

// 请求错误类
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public response?: Response
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

// 超时处理
const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout")), ms);
  });
};

// 重试机制
const retryRequest = async (
  requestFn: () => Promise<Response>,
  retries: number
): Promise<Response> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
};

// 通用 HTTP 请求函数
export async function httpRequest<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    timeout = API_CONFIG.TIMEOUT,
    retries = API_CONFIG.RETRY_ATTEMPTS,
    ...requestConfig
  } = config;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultConfig: RequestInit = {
    headers: DEFAULT_HEADERS,
    ...requestConfig,
  };

  const requestFn = () => fetch(url, defaultConfig);

  try {
    const response = await Promise.race([
      retryRequest(requestFn, retries),
      timeoutPromise(timeout),
    ]);

    if (!response.ok) {
      throw new HttpError(response.status, response.statusText, response);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// GET 请求
export async function get<T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<T> {
  return httpRequest<T>(endpoint, { ...config, method: "GET" });
}

// POST 请求
export async function post<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return httpRequest<T>(endpoint, {
    ...config,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUT 请求
export async function put<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return httpRequest<T>(endpoint, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETE 请求
export async function del<T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<T> {
  return httpRequest<T>(endpoint, { ...config, method: "DELETE" });
}

// 构建查询字符串
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}
