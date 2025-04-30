import { useState } from 'react';

// Custom hook to manage image loading state
const useImageLoader = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Function to be called when image is loaded
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return {
    isImageLoaded,
    handleImageLoad,
  };
};

export default useImageLoader;
