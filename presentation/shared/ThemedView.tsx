import React from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "@/constants/Colors";

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
  style,
  children,
  ...rest
}: Props) => {
  const safeArea = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: bgColor ?? palette.background,
          flex: 1,
          paddingTop: safep ? safeArea.top : 0,
          paddingBottom: safeb ? safeArea.bottom : 0,
          marginHorizontal: margin ? 10 : 0,
        },
        style,
      ]}
      className={className}
      {...rest}
    >
      {children}
    </View>
  );
};

export default ThemedView;
