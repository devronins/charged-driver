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
  Pressable,
} from "react-native";
import icons from "@/constants/icons";

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
  error,
  type,
  ...props
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secure, setSecure] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="w-full">
        {label && <Text className={`text-lg font-[500] mb-3 ${labelStyle}`}>{label}</Text>}
        <View
          className={`flex flex-row justify-start items-center relative rounded-md ${Platform.OS === "ios" ? "px-3 py-4" : "px-2"} font-normal text-sm text-text-300 border ${error ? "border-red-500" : isFocused ? "border-primary-300" : "border-border-300"} ${containerStyle}`}
        >
          {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
          <TextInput
            className={`rounded-md font-normal text-[18px] text-text-300 flex-1 ${inputStyle} text-left`}
            secureTextEntry={type === "password" && secure} //allow only for type password
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
            placeholderTextColor="#333333"
          />
          {type === "password" && (
            <Pressable onPress={() => setSecure(!secure)}>
              {secure ? (
                <icons.EyeOff size={20} color="#5A5660" />
              ) : (
                <icons.Eye size={20} color="#5A5660" />
              )}
            </Pressable>
          )}
        </View>
        {error && <Text className={`text-lg text-red-500 font-normal mt-1`}>{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;
