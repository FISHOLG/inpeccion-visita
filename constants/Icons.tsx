import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
interface IconProps {
  size?: number;
  color?: string;
  style?: object;
  onPress?: () => void;
  className?: string;
}

export const LoginIcon = (props: IconProps) => (
  <MaterialCommunityIcons name="login" size={24} color="white" {...props} />
);

export const LogoutIcon = (props: IconProps) => (
  <MaterialCommunityIcons name="logout" size={24} color="white" {...props} />
);

export const SpinnerIcon = ({ size = 24, color = "white" }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate }],
      }}
    >
      <MaterialCommunityIcons name="loading" size={size} color={color} />
    </Animated.View>
  );
};

export const UserIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="account-cog"
    size={24}
    color="white"
    {...props}
  />
);

export const SaveIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="content-save"
    size={24}
    color="white"
    {...props}
  />
);

export const CloseIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="window-close"
    size={24}
    color="white"
    {...props}
  />
);

export const ReloadIcon = (props: IconProps) => (
  <MaterialCommunityIcons name="reload" size={24} color="white" {...props} />
);

export const CheckBoxIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="checkbox-marked"
    size={24}
    color="white"
    {...props}
  />
);

export const CarIcon = (props: IconProps) => (
  <MaterialCommunityIcons name="car" size={24} color="white" {...props} />
);

export const CarLeftIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="car-arrow-left"
    size={24}
    color="white"
    {...props}
  />
);

export const CarRightIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="car-arrow-right"
    size={24}
    color="white"
    {...props}
  />
);

export const BookSearchIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="book-search"
    size={24}
    color="white"
    {...props}
  />
);

export const ArrowLeftIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="arrow-left-thick"
    size={24}
    color="white"
    {...props}
  />
);

export const ArrowLeftBoldIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="arrow-left-bold"
    size={24}
    color="white"
    {...props}
  />
);

export const ArrowRightBoldIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="arrow-right-bold"
    size={24}
    color="white"
    {...props}
  />
);

export const CameraIcon = (props: IconProps) => (
  <MaterialCommunityIcons name="camera" size={24} color="white" {...props} />
);

export const ExclamationIcon = (props: IconProps) => (
  <MaterialCommunityIcons
    name="exclamation-thick"
    size={24}
    color="white"
    {...props}
  />
);
