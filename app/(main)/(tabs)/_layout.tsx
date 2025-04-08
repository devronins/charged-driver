import Icons from "@/constants/icons";
import { Tabs } from "expo-router";
import { LucideProps } from "lucide-react-native";
import { View, Text, Platform } from "react-native";

type TabIconProps = {
  Icon: React.ComponentType<LucideProps>;
  title: string;
  focused: boolean;
};

const TabIcon = ({ Icon, title, focused }: TabIconProps) => (
  <View className="flex flex-col items-center gap-1">
    <Icon color={focused ? "#007FFF" : "#5A5660"} className="w-7 h-7" />
    <Text className={`w-full ${focused ? "text-primary-300" : "text-text-300"}`}>{title}</Text>
  </View>
);

const tabScreenHeaderStyles = {
  headerTitleStyle: {
    color: "#007FFF",
    fontWeight: "bold",
    fontSize: 18,
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerStyle: {
    elevation: 0, // Android shadow
    shadowOpacity: 0, // iOS shadow
    borderBottomWidth: 0, // Top border (iOS sometimes shows it)
    backgroundColor: "white", // Keep background clean
  },
};

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "white",
          overflow: "hidden",
          height: Platform.OS === "ios" ? 100 : 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexDirection: "row",
          paddingTop: 20,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon Icon={Icons.HomeIcon} title="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="earning"
        options={{
          title: "Earnings",
          headerTitleStyle: tabScreenHeaderStyles.headerTitleStyle,
          headerStyle: tabScreenHeaderStyles.headerStyle,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon Icon={Icons.Wallet} title="Earnings" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleStyle: tabScreenHeaderStyles.headerTitleStyle,
          headerStyle: tabScreenHeaderStyles.headerStyle,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon Icon={Icons.UserRound} title="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
