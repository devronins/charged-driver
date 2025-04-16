import { View, Text, TouchableOpacity, Linking, Platform, AppState } from "react-native";
import { CheckCircle, XCircle } from "lucide-react-native";
import { Model } from "@/components/ui/model";
import { PermissionTypeEnum } from "@/reducers";
import { useTypedSelector } from "@/store";
import CustomButton from "../ui/CustomButton";

export default function PermissionModal() {
  const { location } = useTypedSelector(state => state.Permission);

  const openSettings = () => {
    Linking.openSettings();
  };

  const getStatusIcon = (granted: boolean) =>
    granted ? <CheckCircle size={20} color="green" /> : <XCircle size={20} color="red" />;

  return (
    <Model
      open={location.grantedBackground === PermissionTypeEnum.DENIED}
      setValue={() => {}}
      className="flex-1"
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="w-full bg-white rounded-t-2xl p-6 space-y-4">
          <Text className="text-lg font-semibold text-center">📲 Please Allow All Permissions</Text>

          <View className="space-y-8 mt-3">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-base">Background Location</Text>
                <Text className="text-xs text-gray-500 -mt-1">Set to “Allow all the time”</Text>
              </View>
              {getStatusIcon(location.grantedBackground === PermissionTypeEnum.GRANTED)}
            </View>
          </View>

          <CustomButton
            title="Open Settings"
            onPress={openSettings}
            className="bg-blue-600 py-2 rounded-xl mt-"
          />
        </View>
      </View>
    </Model>
  );
}
