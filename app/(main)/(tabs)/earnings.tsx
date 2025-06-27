import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Earnings from '@/components/earnings/earnings';

const EarningsScreen: React.FC = () => {
  return (
    <View className="flex-1">
      <Earnings />
    </View>
  );
};

export default EarningsScreen;
