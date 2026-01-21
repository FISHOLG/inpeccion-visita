
import { Alert, Platform } from 'react-native';

export const ConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
) => {
    if (Platform.OS === 'web') {
        const confirmed = window.confirm(`${title}\n\n${message}`);
        if (confirmed) {
            onConfirm();
        } else {
            if (onCancel) onCancel();
        }
    } else {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                    onPress: onCancel,
                },
                {
                    text: 'Confirmar',
                    onPress: onConfirm,
                },
            ],
            { cancelable: false }
        );
    }
};
