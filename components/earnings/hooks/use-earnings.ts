// hooks/useEarnings.ts

import { useFilteredEarnings } from './use-filtered-earnings';
import { useRides } from './use-rides';
import { useTimeRange } from './use-time-range';

export const useEarnings = () => {
  const { rides, loading, refreshing, onRefresh } = useRides();
  const { timeRangeOptions, selectedTimeRange, setSelectedTimeRange } = useTimeRange();
  const filteredEarnings = useFilteredEarnings(rides, selectedTimeRange.value);

  return {
    timeRangeOptions,
    selectedTimeRange,
    setSelectedTimeRange,
    refreshing,
    onRefresh,
    filteredEarnings,
    loading,
  };
};
