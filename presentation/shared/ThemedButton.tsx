import React from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { cx, elevation } from "@/constants/Theme";

type Variant = "primary" | "success" | "danger" | "accent" | "neutral" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends PressableProps {
  className?: string;
  children: React.ReactNode;
  color?: string;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
}

const variantBg: Record<Variant, string> = {
  primary: "bg-app-primary",
  success: "bg-app-success",
  danger: "bg-app-danger",
  accent: "bg-app-accent",
  neutral: "bg-app-surfaceAlt border border-app-border",
  ghost: "bg-transparent border border-app-borderStrong",
};

const variantText: Record<Variant, string> = {
  primary: "text-white",
  success: "text-white",
  danger: "text-white",
  accent: "text-white",
  neutral: "text-app-textMain",
  ghost: "text-app-primary",
};

const sizePadding: Record<Size, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-4",
};

const sizeText: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const ThemedButton = ({
  className,
  children,
  color,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block = false,
  disabled,
  style,
  ...rest
}: Props) => {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={[variant !== "ghost" && elevation(1), style]}
      className={cx(
        "flex-row items-center justify-center gap-x-2 rounded-xl active:opacity-75",
        color ?? variantBg[variant],
        sizePadding[size],
        block && "w-full",
        disabled && "opacity-50",
        className,
      )}
      {...rest}
    >
      {icon ? <View>{icon}</View> : null}
      {typeof children === "string" ? (
        <Text
          className={cx(
            "font-bold uppercase tracking-wide",
            sizeText[size],
            className?.includes("text-") ? undefined : variantText[variant],
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {iconRight ? <View>{iconRight}</View> : null}
    </Pressable>
  );
};

export default ThemedButton;
