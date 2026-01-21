import React from "react";
import { View, Pressable } from "react-native";
import ThemedText from "@/presentation/shared/ThemedText";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import { LogoutIcon } from "@/constants/Icons";
import { router } from "expo-router";

const UserNavbar = () => {
  const { auth, logOut } = useAuthContext();

  const cerrarSesion = () => {
    logOut();
    router.replace("/login");
  };

  return (
    <View className={"flex-row items-center gap-x-3"}>
      <ThemedText type={"h4"}>
        {auth?.nombrUsr} ({auth?.codUsr})
      </ThemedText>
      <Pressable
        onPress={cerrarSesion}
        className={"bg-light-danger dark:bg-dark-danger p-3 rounded-lg"}
      >
        <LogoutIcon />
      </Pressable>
    </View>
  );
};

export default UserNavbar;
