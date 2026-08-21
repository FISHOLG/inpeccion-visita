import { LogoutIcon } from "@/constants/Icons";
import { palette } from "@/constants/Colors";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import ThemedText from "@/presentation/shared/ThemedText";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

const UserNavbar = () => {
  const { auth, logOut } = useAuthContext();

  const cerrarSesion = () => {
    logOut();
    router.replace("/login");
  };

  const iniciales = (auth?.nombrUsr ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <View className="flex-row items-center gap-x-2">
      <View
        className="flex-row items-center gap-x-2 rounded-full py-1 pl-1 pr-3"
        style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
      >
        <View className="h-7 w-7 items-center justify-center rounded-full bg-app-accent">
          <ThemedText type="caption" className="text-white">
            {iniciales || "--"}
          </ThemedText>
        </View>
        <ThemedText type="caption" className="text-white" numberOfLines={1}>
          {auth?.codUsr}
        </ThemedText>
      </View>

      <Pressable
        onPress={cerrarSesion}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesion"
        className="rounded-full bg-app-danger p-2 active:opacity-70"
      >
        <LogoutIcon size={20} color={palette.onPrimary} />
      </Pressable>
    </View>
  );
};

export default UserNavbar;
