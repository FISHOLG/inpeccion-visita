import React from "react";
import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends ViewProps {
  safep?: boolean;
  safeb?: boolean;
  margin?: boolean;
  className?: string;
  bgColor?: string;
}

const ThemedView = ({
  className,
  safeb = false,
  safep = false,
  margin = false,
  bgColor,
  children,
}: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const backgroundColor = bgColor ?? useThemeColor({}, "background");
  const safeArea = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flex: 1,
        paddingTop: safep ? safeArea.top : 0,
        paddingBottom: safeb ? safeArea.bottom : 0,
        marginHorizontal: margin ? 10 : 0,
      }}
      className={className}
    >
      {children}
    </View>
  );
};

export default ThemedView;
