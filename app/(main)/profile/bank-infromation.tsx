import { ScrollView, View } from 'react-native';
import BankInfromationForm from '@/components/bank-infromation/bank-infromation-form';
import BankInfromationInfo from '@/components/bank-infromation/bank-infromation-info';
import { useAppDispatch, useTypedSelector } from '@/store';

const BankInfromation = () => {
  return (
    <View className="h-screen flex-1 flex-col items-center p-6 gap-5 bg-secondary-300">
      <BankInfromationInfo />
      <BankInfromationForm />
    </View>
  );
};

export default BankInfromation;
