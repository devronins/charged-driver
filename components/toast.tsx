import { Toast } from "@/utils/toast";
import { BaseToast } from "react-native-toast-message";

const ToastComponent = () => {

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{
                    borderRadius: 10,
                    width: '95%'
                }}
            />
        ),
    };

    return <Toast config={toastConfig} />
}

export { ToastComponent }