import Icons from '@/constants/icons';
import { VehicleActions } from '@/reducers';
import { appStateTaskHandler, getDriver } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, Platform, Text, TouchableOpacity } from 'react-native';

const Layout = () => {
  const dispatch = useAppDispatch();
  const { isLogin, driverDetails } = useTypedSelector((state) => state.Driver);
  const { isEditMode, vehicleDetails } = useTypedSelector((state) => state.Vehicle);
  const driverRef = useRef(driverDetails);

  useEffect(() => {
    driverRef.current = driverDetails;
  }, [driverDetails]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        appStateTaskHandler(dispatch, {
          is_driver_online: driverRef.current?.is_online ? true : false,
        });
      }
    });

    return () => sub.remove();
  }, []);

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return (
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
    </Stack>
  );
};

export default Layout;
