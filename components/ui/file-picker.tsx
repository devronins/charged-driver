import { TouchableOpacity, View } from 'react-native';
import { Model } from './model';
import { LottieView } from '@/utils/lottie';
import { CameraJson, GalleryJson } from '@/constants/animation';
import { PickerSourceEnumType } from '@/services';

const FilePicker = ({ handleUploadImage }: { handleUploadImage: Function }) => {
  return (
    <View className="w-full bg-white rounded-t-lg flex flex-row justify-between h-[20%] px-10">
      <TouchableOpacity
        className="flex items-center justify-center w-[100px] h-[100px] mt-[4%]"
        onPress={() => handleUploadImage(PickerSourceEnumType.Camera)}
      >
        <LottieView source={CameraJson} style={{ width: '100%', height: '100%' }} loop autoPlay />
      </TouchableOpacity>
      <TouchableOpacity
        className="flex items-center justify-center w-[90px] h-[90px] mt-[2%]"
        onPress={() => handleUploadImage(PickerSourceEnumType.Gallery)}
      >
        <LottieView source={GalleryJson} style={{ width: '100%', height: '100%' }} loop autoPlay />
      </TouchableOpacity>
    </View>
  );
};
export default FilePicker;
