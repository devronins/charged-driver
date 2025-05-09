import { firebaseApi } from '@/api/firebase';
import RideRequests from '@/components/ride/ride-requests';
import Icons from '@/constants/icons';
import { VehicleActions } from '@/reducers';
import { appStateTaskHandler, getDriver } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { firebaseCollectionName } from '@/utils/modals/firebase';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, Platform, Text, TouchableOpacity } from 'react-native';
import { useAppState } from '@react-native-community/hooks';

const Layout = () => {
  const dispatch = useAppDispatch();
  const { isLogin, driverDetails } = useTypedSelector((state) => state.Driver);
  const { isEditMode, vehicleDetails } = useTypedSelector((state) => state.Vehicle);
  const { activeRide } = useTypedSelector((state) => state.Ride);
  const appState = useAppState();

  useEffect(() => {
    if (activeRide) {
      firebaseApi.stopFirebaseListener(firebaseCollectionName.DriverRides);
    } else if (driverDetails?.is_online) {
      firebaseApi.startFirebaseListner(firebaseCollectionName.DriverRides, dispatch, driverDetails);
    } else if (driverDetails?.is_online === false) {
      firebaseApi.stopFirebaseListener(firebaseCollectionName.DriverRides);
    }

    return () => firebaseApi.stopFirebaseListener(firebaseCollectionName.DriverRides);
  }, [driverDetails, activeRide]);

  useEffect(() => {
    if (appState === 'active' && (driverDetails?.is_online || activeRide)) {
      appStateTaskHandler(dispatch);
    }
  }, [appState, driverDetails, activeRide]);

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return (
    <>
      <Stack
        screenOptions={{
          animation: Platform.OS === 'ios' ? 'slide_from_right' : 'none',
          headerBackVisible: false, // for hide default android arrow back button
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/vehicle-infromation"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Vehicle Information',
            headerTitleAlign: 'center', // for android
            headerTitleStyle: {
              color: '#007FFF',
              paddingLeft: 0,
              text: 'center',
            },
            headerLeft: () => (
              <TouchableOpacity
                className="h-auto flex items-start justify-center"
                onPressIn={() => navigation.goBack()}
              >
                <Icons.ChevronLeft size={30} color="#5A5660" />
              </TouchableOpacity>
            ),
            headerRight: () => {
              return vehicleDetails ? (
                <TouchableOpacity
                  className="h-auto flex items-end justify-center px-2"
                  onPressIn={() => {
                    dispatch(VehicleActions.setIsEditMode({ status: !isEditMode }));
                  }}
                >
                  <Text className="text-primary-300">{isEditMode ? 'Cancel' : 'Edit'}</Text>
                </TouchableOpacity>
              ) : null;
            },
          })}
        />
        <Stack.Screen
          name="profile/driver-document"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Documents',
            headerTitleAlign: 'center', // for android
            headerTitleStyle: {
              color: '#007FFF',
              paddingLeft: 0,
              text: 'center',
            },
            headerLeft: () => (
              <TouchableOpacity
                className="w-[90px] h-10 flex items-start justify-center px-1"
                onPressIn={() => navigation.goBack()}
              >
                <Icons.ChevronLeft size={30} color="#5A5660" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="ride/active-ride"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Active Ride',
            headerTitleAlign: 'center', // for android
            headerTitleStyle: {
              color: '#007FFF',
              paddingLeft: 0,
              text: 'center',
            },
            headerLeft: () => (
              <TouchableOpacity
                className="w-[90px] h-10 flex items-start justify-center px-1"
                onPressIn={() => navigation.goBack()}
              >
                <Icons.ChevronLeft size={30} color="#5A5660" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack>
      <RideRequests />
    </>
  );
};

export default Layout;
