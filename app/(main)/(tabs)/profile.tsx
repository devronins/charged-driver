import ProfileLogout from '@/components/profile/profile-logout-section';
import ProfilePageNavigation from '@/components/profile/profile-page-navigation';
import ProfileSection from '@/components/profile/profile-section';
import Loader from '@/components/ui/Loader';
import { useTypedSelector } from '@/store';
import { ScrollView, Text, View } from 'react-native';

const Profile = () => {
  const { driverDetailsLoading } = useTypedSelector((state) => state.Driver);
  return (
    <>
      <ScrollView className="relative flex-1 bg-secondary-300">
        <View className="flex-1 flex flex-col items-center p-6 gap-5">
          <ProfileSection />
          <ProfilePageNavigation />
          <ProfileLogout />
        </View>
      </ScrollView>
      <Loader open={driverDetailsLoading} />
    </>
  );
};

export default Profile;
