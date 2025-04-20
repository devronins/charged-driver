import { useAppDispatch, useTypedSelector } from '@/store';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icons from '@/constants/icons';
import { LottieView } from '@/utils/lottie';
import { CameraJson, GalleryJson } from '@/constants/animation';
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

const ProfileSection = () => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const { driverDetails, accessToken } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();

  const handleUploadImage = async (modeType: PickerSourceEnumType) => {
    setIsModelVisible(false);
    const imageData =
      modeType === PickerSourceEnumType.Camera
        ? await pickImageFromCamera()
        : await pickImageFromGallery();

    if (imageData === null) {
      Toast.show({
        type: 'info',
        text1: "you have'nt selected any image",
      });
    } else {
      dispatch(uploadDriverProfileImage({ data: imageData }));
    }
  };

  return (
    <View className="w-full h-auto p-7 bg-white rounded-lg flex flex-col items-center">
      <View className="flex flex-col items-center gap-0">
        <View className="flex items-center justify-center relayive">
          <Image
            source={driverDetails?.photo ? { uri: driverDetails?.photo } : images.AvatarImage}
            className="h-[130px] w-[130px] rounded-full"
            resizeMode="contain"
          />
          <View className="absolute bottom-1 right-1 rounded-full border-white border-[2px] p-1 bg-primary-300">
            <Icons.Camera color="#007FFF" className="w-5 h-5" fill={'#FFFFFF'} />
          </View>
        </View>
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
        <View className="w-full bg-white rounded-t-lg flex flex-row items-center justify-between h-40 px-10">
          <TouchableOpacity
            className="flex items-center justify-center w-[100px] h-[100px] mt-7"
            onPress={() => handleUploadImage(PickerSourceEnumType.Camera)}
          >
            <LottieView
              source={CameraJson}
              style={{ width: '100%', height: '100%' }}
              loop
              autoPlay
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex items-center justify-center w-[90px] h-[90px]"
            onPress={() => handleUploadImage(PickerSourceEnumType.Gallery)}
          >
            <LottieView
              source={GalleryJson}
              style={{ width: '100%', height: '100%' }}
              loop
              autoPlay
            />
          </TouchableOpacity>
        </View>
      </Model>
    </View>
  );
};

export default ProfileSection;
