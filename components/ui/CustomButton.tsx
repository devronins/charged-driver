import { TouchableOpacity, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { ButtonProps } from '@/types/type';

const getBgVariantStyle = (variant: ButtonProps['bgVariant']) => {
  switch (variant) {
    case 'secondary':
      return 'bg-gray-500';
    case 'danger':
      return 'bg-red-500';
    case 'success':
      return 'bg-green-500';
    case 'outline':
      return 'bg-transparent border-neutral-300 border-[0.5px]';
    default:
      return 'bg-primary-300';
  }
};

const getTextVariantStyle = (variant: ButtonProps['textVariant']) => {
  switch (variant) {
    case 'primary':
      return 'text-text-300';
    case 'secondary':
      return 'text-gray-100';
    case 'danger':
      return 'text-red-100';
    case 'success':
      return 'text-green-100';
    default:
      return 'text-white';
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = 'primary',
  textVariant = 'default',
  IconLeft,
  IconRight,
  className,
  titleStyle,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={twMerge(
        'w-full rounded-lg p-3 flex flex-row justify-center items-center',
        getBgVariantStyle(bgVariant),
        className
      )}
      {...props}
    >
      {IconLeft ? IconLeft : null}
      <Text
        className={twMerge('text-lg font-normal', getTextVariantStyle(textVariant), titleStyle)}
      >
        {title}
      </Text>
      {IconRight ? IconRight : null}
    </TouchableOpacity>
  );
};

export default CustomButton;
