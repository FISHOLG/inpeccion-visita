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
  const base = React.useMemo(
    () =>
      cx(
        "overflow-hidden rounded-2xl border border-app-border bg-app-surface",
        onPress && !disabled && "active:opacity-75",
        disabled && "opacity-60",
        className,
      ),
    [onPress, disabled, className],
  );

  const estilo = React.useMemo(
    () => [elevation(level), style],
    [level, style],
  );

  const estiloAcento = React.useMemo(
    () => (accentColor ? { width: 6, backgroundColor: accentColor } : null),
    [accentColor],
  );

  const content = estiloAcento ? (
    <View className="flex-row">
      <View style={estiloAcento} />
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
        style={estilo}
        className={base}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={estilo} className={base} {...rest}>
      {content}
    </View>
  );
};

export default React.memo(Card);
