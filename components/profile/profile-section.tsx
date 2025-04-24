import { useAppDispatch, useTypedSelector } from '@/store';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import Icons from '@/constants/icons';
import images from '@/constants/images';
import {
  PickerSourceEnumType,
  pickImageFromCamera,
  pickImageFromGallery,
  uploadDriverProfileImage,
} from '@/services';
import { Model } from '../ui/model';
import { useState } from 'react';
import { Toast } from '@/utils/toast';
import FilePicker from '../ui/file-picker';
import LottieView from 'lottie-react-native';
import { ImageLoaderJson } from '@/constants/animation';
import useImageLoader from '@/hooks/use-image-loader';
// import FilePickerModel from '../ui/file-picker-model';

const ProfileSection = () => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const { handleImageLoad, isImageLoaded } = useImageLoader();
  const { driverDetails, accessToken } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();

  const handleUploadImage = async (modeType: PickerSourceEnumType) => {
    try {
      const imageData =
        modeType === PickerSourceEnumType.Camera
          ? await pickImageFromCamera()
          : await pickImageFromGallery();
      setIsModelVisible(false);

      if (imageData === null) {
        Toast.show({
          type: 'info',
          text1: "you have'nt selected any image",
        });
      } else if (imageData?.fileSize === null) {
        Toast.show({
          type: 'info',
          text1: 'Could not retrieve file info.',
        });
      } else if (imageData?.fileSize > 5) {
        Toast.show({
          type: 'info',
          text1: 'Please select an image smaller than 5MB',
        });
      } else {
        dispatch(uploadDriverProfileImage({ imageData: imageData, driverDetails }));
      }
    } catch (error: any) {
      setIsModelVisible(false);
      Toast.show({
        type: 'error',
        text1: error?.data?.message || "Oop's something went wrong!",
      });
    }
  };
  return (
    <View className="w-full h-auto p-7 bg-white rounded-lg flex flex-col items-center">
      <View className="flex flex-col items-center gap-0">
        <ImageBackground
          source={images.AvatarImage}
          className=" flex items-center justify-center relative "
          imageStyle={{ borderRadius: 9999 }}
        >
          {!isImageLoaded && (
            <View className='absolute h-[130px] w-[130px] rounded-full bg-white items-center justify-center'>
              <LottieView
                source={ImageLoaderJson}
                style={{ width: 30, height: 30}}
                loop
                autoPlay
              />
            </View>
          )}

          <Image
            source={driverDetails?.photo ? { uri: driverDetails?.photo } : images.AvatarImage}
            className="h-[130px] w-[130px] rounded-full border-border-300 border-[1px]"
            resizeMode="cover"
          />
          <View className="absolute bottom-1 right-1 rounded-full border-white border-[2px] p-1 bg-primary-300">
            <Icons.Camera color="#007FFF" className="w-5 h-5" fill={'#FFFFFF'} />
          </View>
        </ImageBackground>
        <TouchableOpacity
          className="flex items-center justify-center"
          onPress={() => setIsModelVisible(true)}
        >
          <Text className="text-primary-300 text-[16px]">Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-col items-center gap-1 mt-4">
        <View className="flex items-center justify-center">
          <Text className="text-3xl font-bold">{driverDetails?.name || 'Your Name'}</Text>
        </View>
        <View className="flex items-center justify-center">
          <Text className="text-text-300 text-[16px]">{driverDetails?.email}</Text>
        </View>
      </View>

      <View className="w-full flex flex-row items-center justify-around gap-1 mt-4 border-t-[1px] border-text-100 pt-4">
        <View className="flex flex-col items-center">
          <View className="flex items-center justify-center">
            <Text className="text-[18px] font-bold">{driverDetails?.rating || 0}</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text className="text-[16px] text-text-300">Rating</Text>
          </View>
        </View>
        <View className="flex flex-col items-center">
          <View className="flex items-center justify-center">
            <Text className="text-[18px] font-bold">{driverDetails?.total_rides || 0}</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text className="text-[16px] text-text-300">Rides</Text>
          </View>
        </View>
        <View className="flex flex-col items-center">
          <View className="flex items-center justify-center">
            <Text className="text-[18px] font-bold">3</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text className="text-[16px] text-text-300">Months</Text>
          </View>
        </View>
      </View>

      <Model
        animationType="slide"
        open={isModelVisible}
        setValue={() => setIsModelVisible(false)}
        className={`flex-1 flex items-center justify-end bg-black/30`}
      >
        <FilePicker handleUploadImage={handleUploadImage} />
      </Model>
    </View>
  );
};

export default ProfileSection;
