import { useAppDispatch } from '@/store';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import CustomButton from '../ui/CustomButton';
import Icons from '@/constants/icons';
import { DriverDocumentTypesModal, DriverUploadedDocumentModal } from '@/utils/modals/driver';
import { Model } from '../ui/model';
import {
  PickerSourceEnumType,
  pickImageFromCamera,
  pickImageFromGallery,
  uploadDriverDocument,
} from '@/services';
import { Toast } from '@/utils/toast';
import FilePicker from '../ui/file-picker';
import { useAutoImageSize } from '@/hooks/use-auto-image-size';
import LottieView from 'lottie-react-native';
import { ImageLoaderJson } from '@/constants/animation';
import useImageLoader from '@/hooks/use-image-loader';

const DriverDocumentFormCard = ({
  data,
  uploadedDocumentData,
}: {
  data: DriverDocumentTypesModal;
  uploadedDocumentData: DriverUploadedDocumentModal | null;
}) => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isPreviewModelVisible, setIsPreviewModelVisible] = useState(false);
  const { height: imageHeight } = useAutoImageSize(uploadedDocumentData?.file_url, 75);
  const { handleImageLoad, isImageLoaded } = useImageLoader();

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
        dispatch(uploadDriverDocument({ imageData: imageData, documentTypeId: data.id }));
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
    <View className="w-full h-auto bg-white rounded-lg flex flex-col items-start gap-5 p-5">
      <View className="w-full flex flex-row items-start justify-between">
        <View className="flex felx-col justify-center w-[70%]">
          <View className="flex flex-row items-center justify-start">
            <Text className="text-lg font-bold">{data.display_name}</Text>
          </View>
          <View className="flex flex-row items-center justify-start mt-1">
            <Text className="line-break text-sm text-text-300 leading-tight">
              {data.description}
            </Text>
          </View>
          {data.is_required ? (
            <View className="flex flex-row items-center justify-start mt-2">
              <Text className=" text-sm text-white px-2 rounded-md bg-primary-300">Required</Text>
            </View>
          ) : null}
          {uploadedDocumentData?.rejection_reason && uploadedDocumentData.status === 'rejected' ? (
            <View className="flex flex-row items-center justify-start mt-2">
              <Text className="text-sm text-red-500">{uploadedDocumentData?.rejection_reason}</Text>
            </View>
          ) : null}
        </View>

        <View className="flex flex-row items-center justify-center">
          <Text
            className={`text-sm text-white px-2 py-1 rounded-lg bg-gray-400 ${uploadedDocumentData && uploadedDocumentData.status === 'verified' ? 'bg-tertiary-300' : uploadedDocumentData && uploadedDocumentData.status === 'pending' ? 'bg-yellow-500' : uploadedDocumentData && uploadedDocumentData.status === 'rejected' ? 'bg-red-500' : ''}`}
          >
            {uploadedDocumentData ? uploadedDocumentData.status.toUpperCase() : 'Not Submitted'}
          </Text>
        </View>
      </View>

      {!uploadedDocumentData || uploadedDocumentData.status === 'rejected' ? (
        <CustomButton
          title={uploadedDocumentData?.status === 'rejected' ? 'ReUpload' : 'Upload'}
          className={`${Platform.OS === 'ios' ? 'py-4' : 'py-[8px]'} gap-2`}
          onPress={() => setIsModelVisible(true)}
          disabled={false}
          IconLeft={<Icons.Upload color={'#FFFFFF'} size={20} />}
        />
      ) : null}

      {uploadedDocumentData ? (
        <CustomButton
          title={'Preview'}
          className={`${Platform.OS === 'ios' ? 'py-4' : 'py-[8px]'} gap-2 bg-tertiary-300`}
          onPress={() => setIsPreviewModelVisible(true)}
          disabled={false}
        />
      ) : null}

      <Model
        animationType="slide"
        open={isModelVisible}
        setValue={() => setIsModelVisible(false)}
        className={`flex-1 flex items-center justify-end bg-black/30`}
      >
        <FilePicker handleUploadImage={handleUploadImage} />
      </Model>

      <Model
        animationType="fade"
        open={isPreviewModelVisible}
        setValue={() => setIsPreviewModelVisible(false)}
        className={`flex-1 flex items-center justify-center bg-black/70 p-6`}
      >
        <View className="relative w-full bg-white p-6 border-primary-300 border-2 rounded-lg flex flex-row items-center justify-center min-h-[30%]">
          {!isImageLoaded && (
            <LottieView
              source={ImageLoaderJson}
              style={{ width: 50, height: 50, position: 'absolute' }}
              loop
              autoPlay
            />
          )}

          {/* Image that triggers image load handler */}
          <Image
            source={{ uri: uploadedDocumentData?.file_url }}
            style={{ width: '100%', height: imageHeight }}
            resizeMode="contain"
            onLoad={handleImageLoad} // This will trigger once the image is fully loaded
          />
          <TouchableOpacity
            className="absolute top-1 right-1"
            onPress={() => setIsPreviewModelVisible(false)}
          >
            <Icons.Close size={23} color={'black'} />
          </TouchableOpacity>
        </View>
      </Model>
    </View>
  );
};

export default DriverDocumentFormCard;
