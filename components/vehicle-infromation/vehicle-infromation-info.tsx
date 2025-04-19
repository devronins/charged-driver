import Icons from '@/constants/icons';
import { View, Text } from 'react-native';

const VehicleInfromationInfo = () => {
  return (
    <View className="w-full p-5 flex-row items-start gap-1 bg-card-100 rounded-lg">
      <View className="flex items-center justify-center">
        <Icons.Info size={25} color={'#007FFF'} />
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="line-break text-sm text-text-300">
          Please provide accurate vehicle information. This information is shared with riders and
          used for verification purposes.
        </Text>
      </View>
    </View>
  );
};

export default VehicleInfromationInfo;
