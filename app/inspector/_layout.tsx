import { ArrowLeftIcon } from "@/constants/Icons";
import { palette } from "@/constants/Colors";
import UserNavbar from "@/presentation/components/menu/UserNavbar";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

const InspectorLayout = () => {
  const router = useRouter();

  const onHeaderLeftClick = () => {
    router.back();
    return;
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: palette.navbar },
        headerTintColor: palette.onPrimary,
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
          color: palette.onPrimary,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: palette.background },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <Pressable
              onPress={onHeaderLeftClick}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              className="mr-4 rounded-full p-1.5 active:opacity-60"
              style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
            >
              <ArrowLeftIcon color={palette.onPrimary} size={24} />
            </Pressable>
          ) : null,
        headerRight: () => <UserNavbar />,
      }}
    >
      <Stack.Screen
        name={"index"}
        options={{
          //headerShown: false
          title: "Inspeccion Vehicular",
        }}
      />
      <Stack.Screen
        name={"visita"}
        options={{
          //headerShown: false
          title: "Inspección Vista",
        }}
      />
      <Stack.Screen
        name={"vehicular/vehicularI"}
        options={{
          // headerShown: false
          title: "Ingreso Vehicular",
        }}
      />
      <Stack.Screen
        name={"vehicular/vehicularS"}
        options={{
          // headerShown: false
          title: "Salida Vehicular",
        }}
      />
    </Stack>
  );
};

export default InspectorLayout;
