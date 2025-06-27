// hooks/useRides.ts
import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useTypedSelector } from '@/store';
import { getRides } from '@/services';

export const useRides = () => {
  const dispatch = useAppDispatch();
  const { rides, loading } = useTypedSelector((state) => state.Ride);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getRides({}));
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(getRides({}));
    setRefreshing(false);
  }, [dispatch]);

  return { rides, loading, refreshing, onRefresh };
};
