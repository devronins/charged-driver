// hooks/useTimeRange.ts
import { useState } from 'react';

export type TimeRange = 'today' | 'week' | 'month' | 'all';

export const timeRangeOptions: {
  label: string;
  value: TimeRange;
  title: string;
}[] = [
  { label: 'Today', value: 'today', title: "Today's Earnings" },
  { label: 'This Week', value: 'week', title: "This Week's Earnings" },
  { label: 'This Month', value: 'month', title: "This Month's Earnings" },
  { label: 'All Time', value: 'all', title: 'Total Earnings' },
];

export const useTimeRange = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRangeOptions[0]);
  return { timeRangeOptions, selectedTimeRange, setSelectedTimeRange };
};
