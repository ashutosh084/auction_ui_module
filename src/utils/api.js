import axios from "axios";
import getOrigin from "./getHost";

// Create axios instance with common configuration
const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: getOrigin(),
    withCredentials: true,
    timeout: 10000, // 10 seconds timeout
  });

  // Request interceptor for common request handling
  apiClient.interceptors.request.use(
    (config) => {
      // Add any common request modifications here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for common response handling
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.response?.status === 401 || error.response?.status === 400) {
        // These will be handled by the calling components
        return Promise.reject(error);
      }

      // Log other errors for debugging
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Export the configured axios instance
export default createApiClient();
