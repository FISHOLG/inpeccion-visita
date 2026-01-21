// hooks/useScreenOrientation.ts
import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useScreenOrientation() {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'unknown'>('unknown');

    const getOrientationName = (orientation: ScreenOrientation.Orientation) => {
        switch (orientation) {
            case ScreenOrientation.Orientation.PORTRAIT_UP:
            case ScreenOrientation.Orientation.PORTRAIT_DOWN:
                return 'portrait';
            case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
            case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
                return 'landscape';
            default:
                return 'unknown';
        }
    };

    useEffect(() => {
        const fetchOrientation = async () => {
            const currentOrientation = await ScreenOrientation.getOrientationAsync();
            setOrientation(getOrientationName(currentOrientation));
        };

        fetchOrientation();

        const subscription = ScreenOrientation.addOrientationChangeListener(event => {
            const newOrientation = event.orientationInfo.orientation;
            setOrientation(getOrientationName(newOrientation));
        });

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    return orientation;
}
