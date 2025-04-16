import { View, Text } from "react-native";
import { LottieView } from "@/utils/lottie";
import { LoaderJson } from "@/constants/animation";

const Loader = ({ className, open = false }: { className?: string; open?: boolean }) => {
  return open ? (
    <View
      className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black/40 ${className}`}
    >
      <LottieView source={LoaderJson} style={{ width: 150, height: 150 }} loop autoPlay />
    </View>
  ) : null;
};

export default Loader;
