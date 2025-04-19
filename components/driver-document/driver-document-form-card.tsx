import { useAppDispatch, useTypedSelector } from '@/store';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm, yup, yupResolver } from '@/utils/react-hook-form';
import CustomButton from '../ui/CustomButton';
import Icons from '@/constants/icons';
import { LottieView } from '@/utils/lottie';
import { CameraJson, GalleryJson, LoaderJson } from '@/constants/animation';
import { DriverDocumentTypesModal, DriverUploadedDocumentModal } from '@/utils/modals/driver';
import { Model } from '../ui/model';
import { useState } from 'react';
import { PickerSourceEnumType, uploadDriverDocument } from '@/services';

const DriverDocumentFormCard = ({
  data,
  uploadedDocumentData,
}: {
  data: DriverDocumentTypesModal;
  uploadedDocumentData: DriverUploadedDocumentModal | null;
}) => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [isPreviewModelVisible, setIsPreviewModelVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handlePickImage = async (modeType: PickerSourceEnumType) => {
    dispatch(uploadDriverDocument({ data: { documentTypeId: data.id, modeType: modeType } }));
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
          {uploadedDocumentData?.rejection_reason ? (
            <View className="flex flex-row items-center justify-start mt-2">
              <Text className="text-sm text-red-500">{uploadedDocumentData?.rejection_reason}</Text>
            </View>
          ) : null}
        </View>

        <View className="flex flex-row items-center justify-center">
          <Text className="text-sm text-white px-2 py-1 rounded-lg bg-gray-400">
            {uploadedDocumentData ? uploadedDocumentData.status.toUpperCase() : 'Not Submitted'}
          </Text>
        </View>
      </View>

      <CustomButton
        title={
          uploadedDocumentData
            ? uploadedDocumentData.status === 'rejected'
              ? 'ReUpload'
              : uploadedDocumentData.status.toUpperCase()
            : 'Upload'
        }
        className={`${Platform.OS === 'ios' ? 'py-4' : 'py-[8px]'} gap-2 ${uploadedDocumentData?.status === 'pending' ? 'opacity-50' : ''}`}
        onPress={() => setIsModelVisible(true)}
        disabled={
          !uploadedDocumentData || uploadedDocumentData.status === 'rejected' ? false : true
        }
        IconLeft={<Icons.Upload color={'#FFFFFF'} size={20} />}
      />

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
        <View className="w-full bg-white rounded-t-lg flex flex-row items-center justify-between h-40 px-10">
          <TouchableOpacity
            className="flex items-center justify-center w-[100px] h-[100px] mt-7"
            onPress={() => handlePickImage(PickerSourceEnumType.Camera)}
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
            onPress={() => handlePickImage(PickerSourceEnumType.Gallery)}
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

      <Model
        animationType="fade"
        open={isPreviewModelVisible}
        setValue={() => setIsPreviewModelVisible(false)}
        className={`flex-1 flex items-center justify-center bg-black/70 p-6`}
      >
        <View className="relative w-full bg-white p-5 border-primary-300 border-2 rounded-lg flex flex-row items-center justify-center h-[50%]">
          <Image
            source={{ uri: uploadedDocumentData?.file_url }}
            className="w-full h-full"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute top-2 right-2"
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
