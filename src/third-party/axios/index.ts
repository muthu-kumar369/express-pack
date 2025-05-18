import axios, { AxiosInstance, AxiosResponse, AxiosError, Method } from "axios";
import { AxiosHelperConfig, AxiosRequestOptions } from "../types";

export class AxiosHelper {
  private static instance: AxiosHelper | null = null;
  private axiosInstance!: AxiosInstance;
  private baseURL!: string;
  private timeout!: number;
  private headers!: Record<string, string>;

  private constructor(config: AxiosHelperConfig) {
    if (AxiosHelper.instance) {
      return AxiosHelper.instance;
    }

    if (!config.baseURL) {
      throw new Error("Base URL is required to create Axios instance");
    }

    this.baseURL = config.baseURL;
    this.timeout = config.timeout ?? 5000;
    this.headers = config.headers ?? {};

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
      },
    });

    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );

    AxiosHelper.instance = this;
  }

  static getInstance(config: AxiosHelperConfig): AxiosHelper {
    if (!AxiosHelper.instance) {
      AxiosHelper.instance = new AxiosHelper(config);
    }
    return AxiosHelper.instance;
  }

  private handleResponse(response: AxiosResponse) {
    return response;
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      console.error("Server error:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Axios setup error:", error.message);
    }
    return Promise.reject(error);
  }

  async request(method: Method, options: AxiosRequestOptions): Promise<any> {
    const { url, data, headers = {}, params = {}, config = {} } = options;

    try {
      const finalConfig = {
        method,
        url,
        headers: { ...this.headers, ...headers },
        params,
        ...config,
      };

      if (
        ["post", "put", "patch", "delete"].includes(method.toLowerCase()) &&
        data !== undefined
      ) {
        (finalConfig as any).data = data;
      }

      const response = await this.axiosInstance.request(finalConfig);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `${method.toUpperCase()} request failed: ${error.message}`
      );
    }
  }

  async get(options: Omit<AxiosRequestOptions, "data">) {
    return this.request("get", options);
  }

  async post(options: AxiosRequestOptions) {
    return this.request("post", options);
  }

  async put(options: AxiosRequestOptions) {
    return this.request("put", options);
  }

  async patch(options: AxiosRequestOptions) {
    return this.request("patch", options);
  }

  async delete(options: AxiosRequestOptions) {
    return this.request("delete", options);
  }
}
