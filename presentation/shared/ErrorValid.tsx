import React from "react";
import { View } from "react-native";
import { AlertIcon } from "@/constants/Icons";
import { palette } from "@/constants/Colors";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  message: string;
}

const ErrorValid = ({ message }: Props) => {
  return (
    <View className="w-full flex-row items-center gap-x-3 rounded-xl border border-app-danger bg-app-dangerSoft px-4 py-3">
      <AlertIcon size={22} color={palette.danger} />
      <ThemedText
        type="semi-bold"
        className="flex-1 text-app-danger uppercase"
      >
        {message}
      </ThemedText>
    </View>
  );
};

export default ErrorValid;
