import { useAppDispatch, useTypedSelector } from '@/store';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../ui/CustomButton';
import Icons from '@/constants/icons';
import { WebView } from 'react-native-webview';
import { addDriverBankAccount } from '@/services';
import { LottieView } from '@/utils/lottie';
import { LoaderJson } from '@/constants/animation';
import { useEffect, useState } from 'react';
import Loader from '../ui/Loader';

const BankInfromationForm = () => {
  const { addDriverBankAccountUrlDetails, addDriverBankAccountUrlDetailsLoading } =
    useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(true);

  const handleSaveDriverBankInfo = (data: any) => {
    if (typeof data.url && data.url?.includes('/return')) {
      setShow(false);
    }
  };
  useEffect(() => {
    dispatch(addDriverBankAccount({}));
  }, []);

  if (addDriverBankAccountUrlDetailsLoading) {
    return <Loader open={addDriverBankAccountUrlDetailsLoading} />;
  }

  return (
    <View className="w-full flex-1 rounded-lg flex flex-col items-center gap-5">
      {addDriverBankAccountUrlDetails && show ? (
        <View className="flex-1 relative bg-white w-full rounded-lg" style={{ overflow: 'hidden' }}>
          <WebView
            source={{ uri: addDriverBankAccountUrlDetails.url }}
            style={{ flex: 1, width: '100%' }}
            className="rounded-lg"
            startInLoadingState={true}
            onNavigationStateChange={handleSaveDriverBankInfo}
            renderLoading={() => (
              <View className="absolute w-full top-0 bottom-0 flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#635BFF" />
              </View>
            )}
            onError={(error) => {
              setShow(false);
              Alert.alert('Error', 'Failed to load form');
            }}
          />
        </View>
      ) : (
        <View className="w-full bg-white p-5 rounded-lg gap-3">
          <View className="flex flex-row items-center justify-start">
            <Text className="text-lg font-bold text-gray-800">Bank Information</Text>
          </View>

          <View className="flex flex-col gap-1">
            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-medium">Bank Name:</Text>
              <Text className="text-gray-800 font-semibold">Dummy Bank</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-medium">Account Holder:</Text>
              <Text className="text-gray-800 font-semibold">John Doe</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600 font-medium">Account Number:</Text>
              <Text className="text-gray-800 font-semibold">**** 1234</Text>
            </View>
          </View>

          <CustomButton
            title={'Edit Bank Info'}
            titleStyle={'text-center text-sm text-white font-bold'}
            className={`${Platform.OS === 'ios' ? 'py-3' : 'py-2'} gap-2`}
            IconLeft={
              addDriverBankAccountUrlDetailsLoading ? (
                <LottieView source={LoaderJson} style={{ width: 25, height: 25 }} loop autoPlay />
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default BankInfromationForm;
