import { Toast } from '@/utils/toast';
import { BaseToast } from 'react-native-toast-message';

const ToastComponent = () => {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderRadius: 10,
          width: '95%',
          zIndex: 9999, // ensure it's higher
          elevation: 10, // for Android
        }}
        contentContainerStyle={{
          zIndex: 9999,
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
};

export { ToastComponent };
