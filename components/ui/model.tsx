import React, { useEffect } from 'react';
import {
    Modal,
    ModalProps,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

type ModelProps = ModalProps & {
    open: boolean;
    className: string;
    setValue: () => void;
    children: React.ReactNode;
};

function Model({ open, setValue, className, children, ...props }: ModelProps) {

    return (
        <Modal visible={open} transparent {...props}>
            <TouchableWithoutFeedback onPress={setValue}>
                <View className={className}>
                    {/* Inner wrapper to block taps and hold modal content */}
                    <TouchableWithoutFeedback onPress={() => { }}>
                        {children}
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}


export { Model };