import { useEffect, useState } from 'react';
import { Image, Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const paddingOffset = 80;

export function useAutoImageSize(uri?: string, offsetWidth: number = 0) {
  const [imageSize, setImageSize] = useState({ width: 300, height: 0 });

  useEffect(() => {
    if (!uri) return;

    const adjustedWidth = screenWidth - offsetWidth;

    Image.getSize(
      uri,
      (originalWidth, originalHeight) => {
        const scaleFactor = adjustedWidth / originalWidth;
        const adjustedHeight = originalHeight * scaleFactor;
        setImageSize({ width: adjustedWidth, height: adjustedHeight });
      },
      (error) => {
        console.error('Failed to get image size:', error);
      }
    );
  }, [uri, offsetWidth]);

  return imageSize;
}
