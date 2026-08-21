import React from "react";
import { View } from "react-native";
import { chipTone, ChipTone, cx } from "@/constants/Theme";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  label: string;
  tone?: ChipTone;
  icon?: React.ReactNode;
  className?: string;
}

const Chip = ({ label, tone = "neutral", icon, className }: Props) => {
  const styles = chipTone[tone];

  return (
    <View
      className={cx(
        "flex-row items-center gap-x-1.5 self-start rounded-full px-3 py-1",
        styles.bg,
        className,
      )}
    >
      {icon}
      <ThemedText type="caption" className={cx("uppercase", styles.text)}>
        {label}
      </ThemedText>
    </View>
  );
};

export default Chip;
