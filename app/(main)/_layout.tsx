import { firebaseApi } from '@/api/firebase';
import RideRequests from '@/components/ride/ride-requests';
import Icons from '@/constants/icons';
import { VehicleActions } from '@/reducers';
import { appStateTaskHandler } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, Platform, Text, TouchableOpacity } from 'react-native';
import { useAppState } from '@react-native-community/hooks';

const Layout = () => {
  const dispatch = useAppDispatch();
  const { isLogin, driverDetails } = useTypedSelector((state) => state.Driver);
  const { isEditMode, vehicleDetails } = useTypedSelector((state) => state.Vehicle);
  const { activeRide } = useTypedSelector((state) => state.Ride);
  const appState = useAppState();
  const navigate = useRouter();

  useEffect(() => {
    if (activeRide) {
      firebaseApi.stopFirebaseDriverRideListener(dispatch);
    } else if (driverDetails?.is_online) {
      firebaseApi.startFirebaseDriverRideListner(dispatch, driverDetails);
    } else if (driverDetails?.is_online === false) {
      firebaseApi.stopFirebaseDriverRideListener(dispatch);
    }

    return () => firebaseApi.stopFirebaseDriverRideListener(dispatch);
  }, [driverDetails, activeRide]);

  useEffect(() => {
    if (activeRide) {
      firebaseApi.startFirebaseRidesListner(dispatch, activeRide);
    } else if (!activeRide) {
      firebaseApi.stopFirebaseRidesListener();
    }
  }, [activeRide]);

  useEffect(() => {
    if (appState === 'active' && (driverDetails?.is_online || activeRide)) {
      appStateTaskHandler(dispatch);
    }
  }, [driverDetails, activeRide]);

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
          name="profile/bank-infromation"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Bank Information',
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
            // headerRight: () => {
            //   return vehicleDetails ? (
            //     <TouchableOpacity
            //       className="h-auto flex items-end justify-center px-2"
            //       onPressIn={() => {
            //         dispatch(VehicleActions.setIsEditMode({ status: !isEditMode }));
            //       }}
            //     >
            //       <Text className="text-primary-300">{isEditMode ? 'Cancel' : 'Edit'}</Text>
            //     </TouchableOpacity>
            //   ) : null;
            // },
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

        <Stack.Screen
          name="ride/rides"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Your Rides',
            headerTitleAlign: 'center', // for android
            headerTitleStyle: {
              color: '#007FFF',
              paddingLeft: 0,
              text: 'center',
            },
            headerLeft: () => (
              <TouchableOpacity
                className="w-[90px] h-10 flex items-start justify-center px-1"
                onPressIn={() => navigate.push('/home')}
              >
                <Icons.ChevronLeft size={30} color="#5A5660" />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="ride/ride-cancel-reason"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Cancelation Reasons',
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
          name="ride/ride-details"
          //@ts-ignore
          options={({ navigation }) => ({
            headerTitle: 'Ride Details',
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
