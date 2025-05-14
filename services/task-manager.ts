import * as TaskManager from 'expo-task-manager';
import { Toast } from '@/utils/toast';
import * as Location from 'expo-location';
import { saveRideLocation, updateVehicleDetails } from '@/api/axios';
import { getPersistedSlice } from './common';
import { DriverInitialStateType, RideInitialStateType } from '@/reducers';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

// Define the background location task
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: { data: any; error: any }): Promise<void> => {
    if (error) {
      if (error.code === 1) {
        await stopLocationUpdatesBackgroundTask();
        return;
      }
      console.log('Background Task Error:>>>>>>>>>>>>>>>.', error);
      return;
    }

    if (data) {
      const { locations } = data;
      // console.log('Received new locations in background:', locations);

      const locationObj = locations[0]?.coords;
      // console.log('28>>>>>>>>>>>', locationObj)
      if (locationObj) {
        await updateDriverLocationBackgroundTask({
          last_location_lat: locationObj.latitude,
          last_location_lng: locationObj.longitude, // ❗ Fix this — see next point
          heading: locationObj.heading,
        });
      }
    }
  }
);

export async function stopLocationUpdatesBackgroundTask(): Promise<void> {
  try {
    const hasStarted = await hasStartedLocationUpdatesBackgroundTask();
    if (hasStarted) {
      const res = await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('has stopted location updates background task');
    }
  } catch (error: any) {
    console.log('Stop Location Updates Background Task Error:', error);
    Toast.show({
      type: 'error',
      text1: error,
    });
  }
}

export async function startLocationUpdatesBackgroundTask(): Promise<void> {
  try {
    const res = await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 20000, // 10 seconds
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true, // Show the location indicator in the status bar
      foregroundService: {
        notificationTitle: 'Tracking location',
        notificationBody: 'Location services are running in background',
        notificationColor: '#0000ff',
      },
    });
    console.log('has started location updates background task');
  } catch (error: any) {
    console.log('Start Location Updates Background Task Error:6464646464', error);
    Toast.show({
      type: 'error',
      text1: error,
    });
  }
}

async function updateDriverLocationBackgroundTask(payload: {
  last_location_lat: number;
  last_location_lng: number;
  heading: number;
}): Promise<void> {
  try {
 
    const rideState: RideInitialStateType | null = await getPersistedSlice('Ride');
    const { data } = rideState?.activeRide
      ? await saveRideLocation(rideState.activeRide.id, {
          lat: payload.last_location_lat,
          lng: payload.last_location_lng,
          heading: payload.heading,
        })
      : await updateVehicleDetails(payload);
    
    console.log('new driver location has been updated to server');
  } catch (error: any) {
    console.log('Background Task Error:', error);
    if (process.env.NODE_ENV === 'development') {
      Toast.show({
        type: 'error',
        text1: 'Background task error while updating driver location',
      });
    }
  }
}
export async function hasStartedLocationUpdatesBackgroundTask(): Promise<boolean> {
  try {
    const res = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    return res as boolean;
  } catch (error: any) {
    return false; // ✅ Return default value to satisfy the return type
  }
}
