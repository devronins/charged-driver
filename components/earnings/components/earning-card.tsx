import { formatDate } from '@/utils/common';
import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  date: string;
  fare: number;
};

export const EarningsItem = ({ date, fare }: Props) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
    <Text className="text-sm text-gray-700">{formatDate(date)}</Text>
    <Text className="text-base font-medium text-gray-700">CAD {fare.toFixed(2)}</Text>
  </View>
);
