import eventBus from '@/constants/event';
import { getDriver } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

export default function Index() {
  const { isLogin } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(main)/(tabs)/home" />;
}
