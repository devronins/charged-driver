import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ErrorResponse } from "@/utils/error-response";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: any;
}

const apiConfig: ApiConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
};

const axiosInstance: AxiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(async (req: any) => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  } catch (error) {
    console.error("error", error);
  }
});

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorResponse: ErrorResponse = {};

    if (error.response) {
      // The request was made and the server responded with a status code
      errorResponse.status = error.response.status;
      errorResponse.message = error.message;
      errorResponse.data = error.response.data as any;
    } else if (error.request) {
      // The request was made but no response was received
      errorResponse.message = "Request Error";
    } else {
      // Something happened in setting up the request
      errorResponse.message = error.message;
    }

    return Promise.reject(errorResponse);
  }
);

// API methods
const api = {
  // GET request
  get: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.get<T>(url),

  // POST request
  post: <T>(url: string, data: any): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data),

  // PUT request
  put: <T>(url: string, data: any): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data),

  // DELETE request
  delete: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url),
};

export default api;

//----------------------------------------------------------------------user
export const createUser = (data: any) => axiosInstance.post("/driver/details", data);
export const updateUser = (data: any) => axiosInstance.put(`/driver`, data);
export const fetchUser = () => axiosInstance.get(`/driver`);
export const fetchUsers = (data: any) => axiosInstance.get("/v1/user/getall", { data });
export const deleteUser = (id: string) => axiosInstance.delete(`/v1/user/delete/${id}`);

//---------------------------------------------------------------------upload image
export const fileUpload = (data: any) =>
  axiosInstance.post("/v1/fileUpload", data, {
    onUploadProgress: progressEvent => {
      if (progressEvent && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      }
    },
  });

// export const generatePassCode = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
// export const forgotPassword = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
//export const arboristResetPassword = (data) => API.post("arborist/resetpassword", data)
