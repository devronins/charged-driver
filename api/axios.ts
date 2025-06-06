import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse } from '@/utils/error-response';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { firebaseApi } from './firebase';
import polyline from '@mapbox/polyline';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: any;
}

const apiConfig: ApiConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000000000,
};

const axiosInstance: AxiosInstance = axios.create(apiConfig);

axiosInstance.interceptors.request.use(async (req: any) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
  } catch (error) {
    console.error('error', error);
  }
});

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const errorResponse: ErrorResponse = {};

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { accessToken } = await firebaseApi.getNewAccessToken();
          await AsyncStorage.setItem('accessToken', accessToken);

          // Retry with new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Optional: set new default Authorization
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          return axiosInstance(originalRequest);
        } catch (tokenRefreshError) {
          // Optional: logout or redirect
          console.log('Axios Refresh Token Error:');
          return Promise.reject(tokenRefreshError);
        }
      }

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
  post: <T>(url: string, data: any): Promise<AxiosResponse<T>> => axiosInstance.post<T>(url, data),

  // PUT request
  put: <T>(url: string, data: any): Promise<AxiosResponse<T>> => axiosInstance.put<T>(url, data),

  // DELETE request
  delete: <T>(url: string): Promise<AxiosResponse<T>> => axiosInstance.delete<T>(url),
};

export default api;

//----------------------------------------------------------------------Driver
export const createDriver = (data: any) => axiosInstance.post('/driver/details', data);
export const updateDriver = (data: any) => axiosInstance.put(`/driver`, data);
export const fetchDriver = () => axiosInstance.get(`/driver`);
export const fetchDrivers = (data: any) => axiosInstance.get('/v1/driver/getall', { data });
export const deleteDriver = (id: string) => axiosInstance.delete(`/v1/driver/delete/${id}`);
export const saveRideLocation = (
  id: number,
  data: {
    lat: number;
    lng: number;
    heading: number;
  }
) => axiosInstance.post(`/driver/saveridelocation/${id}`, data);

//----------------------------------------------------------------------Driver vehicles
export const createVehicleDetails = (data: any) => axiosInstance.post(`/driver/details`, data);
export const updateVehicleDetails = (data: any) => axiosInstance.put(`/driver/details`, data);

//----------------------------------------------------------------------Driver documents
export const uploadFileDocument = (type: number, formData: any) =>
  axiosInstance.post(`/driver/uploaddocument/${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: () => {
      return formData;
    },
  });
export const fetchDocumentTypes = () => axiosInstance.get(`/driver/documenttypes`);
export const fetchUploadedDocuments = () => axiosInstance.get(`/driver/documents`);

//----------------------------------------------------------------------Driver Ride
export const updateRideStatus = (id: number, data: any) =>
  axiosInstance.put(`/driver/changeridestatus/${id}`, data);
export const fetchRide = (id: number) => axiosInstance.get(`/driver/getride/${id}`);
export const fetchRides = () => axiosInstance.get('/driver/getmyrides');
export const fetchRideTypes = () => axiosInstance.get('/ride/ridetype');
export const fetchRideMapDirection = async (payload: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: string;
}): Promise<{ latitude: number; longitude: number }[]> => {
  try {
    const { data } = await axiosInstance.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${payload.origin.lat},${payload.origin.lng}&destination=${payload.destination.lat},${payload.destination.lng}&mode=driving&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}${
        payload?.waypoints ? `&waypoints=${payload?.waypoints}` : ''
      }`
    );

    let coords: { latitude: number; longitude: number }[] = [];
    const points = data.routes?.[0]?.overview_polyline?.points;

    if (points) {
      coords = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));
    }

    return coords;
  } catch (error) {
    throw error;
  }
};
export const createRideRating = (id: number, data: any) =>
  axiosInstance.post(`/driver/ride/addrating/${id}`, data);

//---------------------------------------------------------------------upload image
export const fileUpload = (formData: any) =>
  axiosInstance.post(`/driver/uploadfiles`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: () => {
      return formData;
    },
  });

// export const generatePassCode = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
// export const forgotPassword = (data) => axios.post(`${process.env.REACT_APP_API_BASE_URL}`, data)
//export const arboristResetPassword = (data) => API.post("arborist/resetpassword", data)
