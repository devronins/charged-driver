import { RideStatus } from './ride';

export const firebaseCollectionName = {
  DriverRides: 'driverRides',
  Rides: 'rides',
};

export interface firebaseDriverRidesModal {
  driver_earnings: number;
  driver_id: number;
  dropoff_address: string;
  dropoff_lat_lng: string;
  fare: number;
  pickup_address: string;
  pickup_lat_lng: string;
  requested_by: string;
  ride_id: number;
  status?: RideStatus;
}

export interface firebaseRidesModal {
  driver_earnings: number;
  driver_id: number;
  dropoff_address: string;
  dropoff_lat_lng: string;
  fare: number;
  pickup_address: string;
  pickup_lat_lng: string;
  requested_by: string;
  ride_id: number;
  status?: RideStatus;
}
