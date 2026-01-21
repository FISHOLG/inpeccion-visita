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
  | "form-text";

interface Props extends TextProps {
  type?: TextOptions;
  className?: string;
}

const ThemedText = ({ className, type, children, ...rest }: Props) => {
  return (
    <Text
      className={[
        // "text-light-textMain dark:text-dark-textMain",
        type === "normal" ? "font-normal" : undefined,
        type === "h1" ? "font-bold text-xl lg:text-3xl uppercase" : undefined,
        type === "h2" ? "font-semibold text-lg lg:text-2xl" : undefined,
        type === "h3" ? "font-semibold text-base lg:text-xl" : undefined,
        type === "h4" ? "font-semibold text-sm lg:text-lg" : undefined,
        type === "bold" ? "font-bold" : undefined,
        type === "semi-bold" ? "text-sm md:text-base font-semibold" : undefined,
        type === "form-text" ? " text-base md:text-xl  font-semibold uppercase" : undefined,
        !className?.includes("text-") &&
          "text-light-textMain dark:text-dark-textMain",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
