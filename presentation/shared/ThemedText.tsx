import React from "react";
import { Text, TextProps } from "react-native";

type TextOptions =
  | "normal"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bold"
  | "semi-bold"
  | "form-text"
  | "label"
  | "caption"
  | "plate";

interface Props extends TextProps {
  type?: TextOptions;
  className?: string;
}

const variants: Record<TextOptions, string> = {
  normal: "text-base",
  h1: "text-2xl lg:text-3xl font-extrabold uppercase tracking-tight",
  h2: "text-xl lg:text-2xl font-bold",
  h3: "text-base lg:text-xl font-bold",
  h4: "text-sm lg:text-lg font-semibold",
  bold: "font-bold",
  "semi-bold": "text-sm md:text-base font-semibold",
  "form-text": "text-base md:text-lg font-semibold",
  label: "text-xs font-bold uppercase tracking-widest",
  caption: "text-xs font-medium",
  plate: "text-xl lg:text-2xl font-extrabold tracking-[2px] uppercase",
};

const ThemedText = ({ className, type = "normal", children, ...rest }: Props) => {
  return (
    <Text
      className={[
        variants[type] ?? variants.normal,
        !className?.includes("text-app-") &&
          !className?.includes("text-white") &&
          "text-app-textMain",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
