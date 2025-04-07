import { useState } from "react";
import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text className={`text-lg font-[500] mb-3 ${labelStyle}`}>{label}</Text>
        <View
          className={`flex flex-row justify-start items-center relative rounded-md ${Platform.OS === "ios" ? "p-4" : "px-2 py-1"} font-normal text-sm text-text-300 bg-input-300 border ${isFocused ? "border-primary-300" : "border-border-300"} ${containerStyle}`}
        >
          {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
          <TextInput
            className={`rounded-md font-normal text-sm text-text-300 bg-input-300 flex-1 ${inputStyle} text-left`}
            secureTextEntry={secureTextEntry}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;
