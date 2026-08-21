import React from "react";
import { ActivityIndicator, View } from "react-native";
import { palette } from "@/constants/Colors";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  message?: string;
  size?: number;
}

const Loader = ({ message = "Cargando...", size = 42 }: Props) => (
  <View className="flex-1 items-center justify-center gap-y-4 bg-app-background">
    <ActivityIndicator size={size} color={palette.primary} />
    <ThemedText type="label" className="text-app-textSecond">
      {message}
    </ThemedText>
  </View>
);

export default Loader;
