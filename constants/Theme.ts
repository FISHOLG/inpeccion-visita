import { Platform } from "react-native";
import { Colors, palette } from "@/constants/Colors";

export { Colors, palette };

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const elevation = (level: 0 | 1 | 2 | 3 = 1) => {
  if (level === 0) return {};

  const map = {
    1: { radius: 4, opacity: 0.1, offset: 2 },
    2: { radius: 10, opacity: 0.14, offset: 4 },
    3: { radius: 18, opacity: 0.18, offset: 8 },
  } as const;

  const cfg = map[level];

  return Platform.select({
    android: { elevation: cfg.offset * 1.5 },
    default: {
      shadowColor: "#0B1622",
      shadowOpacity: cfg.opacity,
      shadowRadius: cfg.radius,
      shadowOffset: { width: 0, height: cfg.offset },
    },
  });
};

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export const chipTone = {
  primary: { bg: "bg-app-primarySoft", text: "text-app-primaryDeep" },
  success: { bg: "bg-app-successSoft", text: "text-app-success" },
  danger: { bg: "bg-app-dangerSoft", text: "text-app-danger" },
  warning: { bg: "bg-app-warningSoft", text: "text-app-warning" },
  info: { bg: "bg-app-infoSoft", text: "text-app-info" },
  neutral: { bg: "bg-app-surfaceAlt", text: "text-app-textSecond" },
} as const;

export type ChipTone = keyof typeof chipTone;
