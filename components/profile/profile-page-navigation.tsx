import { useAppDispatch, useTypedSelector } from '@/store';
import { Link, useRouter } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Icons from '@/constants/icons';

const navigationContants = [
  {
    id: 1,
    labelIcon: Icons.Camera,
    title: 'Vehicle Infromation',
    href: 'profile/vehicle-infromation',
  },
  {
    id: 2,
    labelIcon: Icons.FileText,
    title: 'Documents',
    href: 'profile/driver-document',
  },
  {
    id: 3,
    labelIcon: Icons.Clock,
    title: 'Ride History',
    href: '#',
  },
  {
    id: 4,
    labelIcon: Icons.Wallet,
    title: 'Earnings',
    href: '#',
  },
  {
    id: 5,
    labelIcon: Icons.HelpCircle,
    title: 'Help & Support',
    href: '#',
  },
];

const ProfilePageNavigation = () => {
  const { driverDetails, accessToken } = useTypedSelector((state) => state.Driver);

  return (
    <View className="w-full h-auto bg-white rounded-lg flex flex-col items-center">
      {navigationContants.map((nav, index) => (
        //@ts-ignore
        <Link href={nav.href}>
          <View
            key={nav.id.toString()}
            className={`w-full flex flex-row items-center justify-between gap-1 p-5 ${index > 0 && 'border-t-[2px] border-secondary-300'}`}
          >
            <View className="flex flex-row items-cente justify-center gap-4">
              <View className="flex items-center justify-center">
                <nav.labelIcon color={'#007FFF'} size={25} />
              </View>
              <View className="flex items-center justify-center">
                <Text className="text-[16px] text-text-300">{nav.title}</Text>
              </View>
            </View>
            <View className="flex flex-col items-center">
              <View className="flex items-center justify-center">
                <Icons.ChevronRight color={'#5A5660'} size={24} />
              </View>
            </View>
          </View>
        </Link>
      ))}
    </View>
  );
};

export default ProfilePageNavigation;
