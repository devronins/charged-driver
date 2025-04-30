import eventBus from '@/constants/event';
import { getDriver } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const { isLogin } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  useEffect(() => {
    const onUpdateDriver = () => dispatch(getDriver({}));
    eventBus.on('driverUpdate', onUpdateDriver);

    return () => {
      eventBus.off('driverUpdate', onUpdateDriver);
    };
  }, []);
  return <Redirect href="/(main)/(tabs)/home" />;
}
