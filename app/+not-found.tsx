import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { palette } from "@/constants/Colors";
import { AlertIcon, ArrowLeftBoldIcon } from "@/constants/Icons";
import ThemedButton from "@/presentation/shared/ThemedButton";
import ThemedText from "@/presentation/shared/ThemedText";
import ThemedView from "@/presentation/shared/ThemedView";

const NotFound = () => {
  return (
    <ThemedView safep safeb>
      <View className="flex-1 items-center justify-center gap-y-5 px-8">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-app-dangerSoft">
          <AlertIcon size={48} color={palette.danger} />
        </View>

        <ThemedText type="h2" className="text-center uppercase text-app-textMain">
          Pantalla no encontrada
        </ThemedText>

        <ThemedText type="caption" className="text-center text-app-textSecond">
          La ruta solicitada no existe o fue movida.
        </ThemedText>

        <ThemedButton
          variant="primary"
          size="lg"
          onPress={() => router.replace("/")}
          icon={<ArrowLeftBoldIcon size={20} color={palette.onPrimary} />}
        >
          Volver al inicio
        </ThemedButton>
      </View>
    </ThemedView>
  );
};

export default NotFound;
