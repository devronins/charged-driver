// hooks/useFilteredEarnings.ts
import { useMemo } from 'react';
import { TimeRange } from './use-time-range';
import { RideModal } from '@/utils/modals/ride';

export const useFilteredEarnings = (rides: RideModal[], selectedTimeRange: TimeRange) => {
  return useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const timeRangeFilters: Record<TimeRange, (date: string) => boolean> = {
      today: (date) => date.startsWith(todayStr),
      week: (date) => new Date(date) >= startOfWeek,
      month: (date) => new Date(date) >= startOfMonth,
      all: () => true,
    };

    const isInRange = timeRangeFilters[selectedTimeRange];
    const filtered = rides.filter((r) => r.completed_at && isInRange(r.completed_at));
    const total = filtered.reduce((sum, r) => sum + Number(r.driver_earnings), 0);

    return { total, rides: filtered };
  }, [rides, selectedTimeRange]);
};
