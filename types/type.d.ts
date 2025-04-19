import React from 'react';
import { TextInputProps, TouchableOpacityProps } from 'react-native';

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success';
  IconLeft?: React.ReactNode;
  IconRight?: React.ReactNode;
  className?: string;
  titleStyle?: strng;
}

declare interface InputFieldProps extends TextInputProps {
  type?: 'password' | 'text';
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  error?: string;
}
