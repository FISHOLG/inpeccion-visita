import React from "react";
import { Pressable, PressableProps, View, ViewProps } from "react-native";
import { cx, elevation } from "@/constants/Theme";

interface Props extends ViewProps {
  className?: string;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  accentColor?: string;
  level?: 0 | 1 | 2 | 3;
  children: React.ReactNode;
}

const Card = ({
  className,
  onPress,
  disabled,
  accentColor,
  level = 1,
  style,
  children,
  ...rest
}: Props) => {
  const base = cx(
    "overflow-hidden rounded-2xl border border-app-border bg-app-surface",
    onPress && !disabled && "active:opacity-75",
    disabled && "opacity-60",
    className,
  );

  const content = accentColor ? (
    <View className="flex-row">
      <View style={{ width: 6, backgroundColor: accentColor }} />
      <View className="flex-1">{children}</View>
    </View>
  ) : (
    children
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[elevation(level), style]}
        className={base}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[elevation(level), style]} className={base} {...rest}>
      {content}
    </View>
  );
};

export default Card;
