import axios from "axios";

export class AxiosHelper {
  static instance = null;

  constructor(config = {}) {
    if (AxiosHelper.instance) {
      return AxiosHelper.instance;
    }

    if (!config?.baseURL) {
      throw new Error("Base URL is required to create Axios instance");
    }

    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 5000;
    this.headers = config.headers || {};

    // Bind methods BEFORE using them in interceptors
    // this.handleResponse = this.handleResponse.bind(this);
    // this.handleError = this.handleError.bind(this);

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

  handleResponse(response) {
    return response;
  }

  handleError(error) {
    if (error.response) {
      console.error("Server error:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Axios setup error:", error.message);
    }
    return Promise.reject(error);
  }

  async request(method, { url, data, headers = {}, params = {}, config = {} }) {
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
        data
      ) {
        finalConfig.data = data;
      }

      const response = await this.axiosInstance.request(finalConfig);
      return response.data;
    } catch (error) {
      throw new Error(
        `${method.toUpperCase()} request failed: ${error.message}`
      );
    }
  }

  async get({ url, params, headers, config }) {
    return this.request("get", { url, params, headers, config });
  }

  async post({ url, data, headers, config }) {
    return this.request("post", { url, data, headers, config });
  }

  async put({ url, params, headers, config }) {
    return this.request("put", { url, params, headers, config });
  }

  async patch({ url, data, headers, config }) {
    return this.request("patch", { url, data, headers, config });
  }

  async delete({ url, data, headers, config }) {
    return this.request("delete", { url, data, headers, config });
  }
}
