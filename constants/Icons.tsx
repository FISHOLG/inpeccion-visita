import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { palette } from "@/constants/Colors";

interface IconProps {
  size?: number;
  color?: string;
  style?: object;
  onPress?: () => void;
  className?: string;
}

type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const makeIcon = (name: MCIName, defaultColor: string = palette.onPrimary) => {
  const Icon = ({ size = 24, color = defaultColor, ...rest }: IconProps) => (
    <MaterialCommunityIcons name={name} size={size} color={color} {...rest} />
  );
  Icon.displayName = `Icon(${name})`;
  return Icon;
};

export const LoginIcon = makeIcon("login-variant");
export const LogoutIcon = makeIcon("logout-variant");
export const UserIcon = makeIcon("account-circle", palette.primary);
export const UserCogIcon = makeIcon("account-cog", palette.primary);
export const LockIcon = makeIcon("lock-outline", palette.textMuted);
export const EyeIcon = makeIcon("eye-outline", palette.textSecond);
export const EyeOffIcon = makeIcon("eye-off-outline", palette.textSecond);
export const BadgeIcon = makeIcon("badge-account-horizontal-outline", palette.textMuted);

export const CarIcon = makeIcon("car-estate", palette.primary);
export const CarLeftIcon = makeIcon("car-arrow-left");
export const CarRightIcon = makeIcon("car-arrow-right");
export const TruckIcon = makeIcon("truck-outline", palette.primary);
export const VanIcon = makeIcon("van-passenger", palette.primary);
export const PlateIcon = makeIcon("card-text-outline", palette.textSecond);
export const ShieldCheckIcon = makeIcon("shield-car", palette.onPrimary);
export const WrenchIcon = makeIcon("car-wrench", palette.primary);
export const GaugeIcon = makeIcon("gauge", palette.primary);
export const ClipboardListIcon = makeIcon("clipboard-list-outline");
export const ClipboardCheckIcon = makeIcon("clipboard-check-outline");
export const BookSearchIcon = makeIcon("clipboard-text-search-outline");

export const SaveIcon = makeIcon("content-save-check-outline");
export const CloseIcon = makeIcon("close");
export const ReloadIcon = makeIcon("refresh", palette.primary);
export const TrashIcon = makeIcon("trash-can-outline");
export const CameraIcon = makeIcon("camera-plus-outline");
export const ImageIcon = makeIcon("image-outline", palette.textSecond);
export const SearchIcon = makeIcon("magnify", palette.textMuted);
export const CheckBoxIcon = makeIcon("checkbox-marked");

export const ArrowLeftIcon = makeIcon("arrow-left");
export const ArrowLeftBoldIcon = makeIcon("arrow-left");
export const ArrowRightBoldIcon = makeIcon("arrow-right");
export const ChevronRightIcon = makeIcon("chevron-right", palette.textMuted);

export const ExclamationIcon = makeIcon("asterisk", palette.danger);
export const AlertIcon = makeIcon("alert-circle-outline", palette.danger);
export const CheckCircleIcon = makeIcon("check-circle-outline", palette.success);
export const InfoIcon = makeIcon("information-outline", palette.info);
export const ClockIcon = makeIcon("clock-outline", palette.textSecond);
export const CalendarIcon = makeIcon("calendar-blank-outline", palette.textSecond);
export const InboxEmptyIcon = makeIcon("clipboard-remove-outline", palette.textMuted);

export const SpinnerIcon = ({
  size = 24,
  color = palette.onPrimary,
}: IconProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <MaterialCommunityIcons name="loading" size={size} color={color} />
    </Animated.View>
  );
};

interface BrandProps {
  size?: number;
  background?: string;
  color?: string;
}

export const BrandMark = ({
  size = 72,
  background = palette.primary,
  color = palette.onPrimary,
}: BrandProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      backgroundColor: background,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <MaterialCommunityIcons
      name="shield-car"
      size={size * 0.58}
      color={color}
    />
  </View>
);
