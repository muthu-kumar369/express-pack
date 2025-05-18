export interface AxiosHelperConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface AxiosRequestOptions {
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  config?: Record<string, any>;
}
