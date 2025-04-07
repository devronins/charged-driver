import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse } from '@/utils/error-response';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: any
}

const apiConfig: ApiConfig = {
    baseURL: Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:3000',
    timeout: Number(Constants.expoConfig?.extra?.API_TIMEOUT) || 10000,
  };

const axiosInstance: AxiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(async (req: any) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        req.headers.Authorization = `${accessToken}`;
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
      errorResponse.message = 'Request Error';
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
  post: <T>(url: string, data: any): Promise<AxiosResponse<T>> =>
    axiosInstance.post<T>(url, data),

  // PUT request
  put: <T>(url: string, data: any): Promise<AxiosResponse<T>> =>
    axiosInstance.put<T>(url, data),

  // DELETE request
  delete: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url),
};

export default api;


//----------------------------------------------------------------------admin
export const adminAuth = (data: any) => axiosInstance.post('/v1/admin/login', data);
export const getAdmin = (id: string) => axiosInstance.get(`/v1/user/${id}`)



//----------------------------------------------------------------------service
export const createService = (data: any) => axiosInstance.post('/v1/service/create', data);
export const updateService = (id: string,data: any) => axiosInstance.put(`/v1/service/update/${id}`, data);
export const fetchService = (id: string) => axiosInstance.get(`/v1/service/get/${id}`)
export const fetchServices = (data: any) => axiosInstance.get('/v1/service/getall', {data});
export const deleteService = (id: string) => axiosInstance.delete(`/v1/service/delete/${id}`)


//----------------------------------------------------------------------service
export const createProperty = (data: any) => axiosInstance.post('/v1/property/create', data);
export const updateProperty = (id: string,data: any) => axiosInstance.put(`/v1/property/update/${id}`, data);
export const fetchProperty = (id: string) => axiosInstance.get(`/v1/property/get/${id}`)
export const fetchProperties = (data: any) => axiosInstance.get('/v1/property/getall', {data});
export const deleteProperty = (id: string) => axiosInstance.delete(`/v1/property/delete/${id}`)


//----------------------------------------------------------------------user
export const createUser = (data: any) => axiosInstance.post('/v1/user/create', data);
export const updateUser = (id: string,data: any) => axiosInstance.put(`/v1/user/update/${id}`, data);
export const fetchUser = (id: string) => axiosInstance.get(`/v1/user/get/${id}`)
export const fetchUsers = (data: any) => axiosInstance.get('/v1/user/getall', {data});
export const deleteUser = (id: string) => axiosInstance.delete(`/v1/user/delete/${id}`)


//----------------------------------------------------------------------category
export const createCategory = (data: any) => axiosInstance.post('/v1/category/create', data);
export const updateCategory = (id: string,data: any) => axiosInstance.put(`/v1/category/update/${id}`, data);
export const fetchCategory = (id: string) => axiosInstance.get(`/v1/category/get/${id}`)
export const fetchCategories = (data: any) => axiosInstance.get('/v1/category/getall', {data});
export const deleteCategory = (id: string) => axiosInstance.delete(`/v1/category/delete/${id}`);

//----------------------------------------------------------------------event
export const createEvent = (data: any) => axiosInstance.post('/v1/event/create', data);
export const updateEvent = (id: string,data: any) => axiosInstance.put(`/v1/event/update/${id}`, data);
export const fetchEvent = (id: string) => axiosInstance.get(`/v1/category/event/${id}`)
export const fetchEvents = (data: any) => axiosInstance.get('/v1/event/getall', {data});
export const deleteEvent = (id: string) => axiosInstance.delete(`/v1/event/delete/${id}`)


//----------------------------------------------------------------------tag
export const createTag = (data: any) => axiosInstance.post('/v1/tag/create', data);
export const updateTag = (id: string,data: any) => axiosInstance.put(`/v1/tag/update/${id}`, data);
export const fetchTag = (id: string) => axiosInstance.get(`/v1/tag/event/${id}`)
export const fetchTags = (data: any) => axiosInstance.get('/v1/tag/getall', {data});
export const deleteTag = (id: string) => axiosInstance.delete(`/v1/tag/delete/${id}`)

//----------------------------------------------------------------------room
export const createRoom = (data: any) => axiosInstance.post('/v1/room/create', data);
export const updateRoom = (id: string,data: any) => axiosInstance.put(`/v1/room/update/${id}`, data);
export const fetchRoom = (id: string) => axiosInstance.get(`/v1/room/event/${id}`)
export const fetchRooms = (data: any) => axiosInstance.get('/v1/room/getall', {data});
export const deleteRoom = (id: string) => axiosInstance.delete(`/v1/room/delete/${id}`)

//----------------------------------------------------------------------room
export const createAbout = (data: any) => axiosInstance.post('/v1/about/create', data);
export const updateAbout = (id: string,data: any) => axiosInstance.put(`/v1/about/update/${id}`, data);
export const fetchAbout = (id: string) => axiosInstance.get(`/v1/about/event/${id}`)
export const fetchAbouts = (data: any) => axiosInstance.get('/v1/about/getall', {data});
export const deleteAbout = (id: string) => axiosInstance.delete(`/v1/about/delete/${id}`)

//----------------------------------------------------------------------experience
export const createExperience = (data: any) => axiosInstance.post('/v1/experience/create', data);
export const updateExperience = (id: string,data: any) => axiosInstance.put(`/v1/experience/update/${id}`, data);
export const fetchExperience = (id: string) => axiosInstance.get(`/v1/experience/event/${id}`)
export const fetchExperiences = (data: any) => axiosInstance.get('/v1/experience/getall', {data});
export const deleteExperience = (id: string) => axiosInstance.delete(`/v1/experience/delete/${id}`)

//----------------------------------------------------------------------home
export const createHome = (data: any) => axiosInstance.post('/v1/home/create', data);
export const updateHome = (id: string,data: any) => axiosInstance.put(`/v1/home/update/${id}`, data);
export const fetchHome = (id: string) => axiosInstance.get(`/v1/home/get/${id}`)
export const fetchHomes = (data: any) => axiosInstance.get('/v1/home/getall', {data});
export const deleteHome = (id: string) => axiosInstance.delete(`/v1/home/delete/${id}`)


//----------------------------------------------------------------------page
export const createPage = (data: any) => axiosInstance.post('/v1/page/create', data);
export const updatePage = (id: string,data: any) => axiosInstance.put(`/v1/page/update/${id}`, data);
export const fetchPage = (id: string) => axiosInstance.get(`/v1/page/get/${id}`)
export const fetchPages = (data: any) => axiosInstance.get('/v1/page/getall', {data});
export const deletePage = (id: string) => axiosInstance.delete(`/v1/page/delete/${id}`)

//---------------------------------------------------------------------upload image
export const fileUpload = (data: any) => axiosInstance.post('/v1/fileUpload', data, {
  onUploadProgress: (progressEvent) => {
    if(progressEvent&&progressEvent.total){
       const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);

    }
   }
});






// export const generatePassCode = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
// export const forgotPassword = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
//export const arboristResetPassword = (data) => API.post("arborist/resetpassword", data)