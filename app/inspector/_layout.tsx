import React from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowLeftIcon } from "@/constants/Icons";
import UserNavbar from "@/presentation/components/menu/UserNavbar";

const InspectorLayout = () => {
    const colorScheme = useColorScheme();
  const navColor = useThemeColor({}, "navbar");

  const navigation = useNavigation();
  const router = useRouter();

  const onHeaderLeftClick = () => {
    router.back();
    return;
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: navColor,
        },
        headerTitleStyle: {
          //textTransform: "uppercase",
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        headerLeft: ({ tintColor, canGoBack }) =>
          canGoBack && (
            <ArrowLeftIcon
              color={tintColor}
              className={"mr-5"}
              onPress={onHeaderLeftClick}
              size={30}
            />
          ),
        headerRight: ({ tintColor, canGoBack }) => <UserNavbar />,
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
          title: "Registrar Ingreso Vehicular",
        }}
      />
      <Stack.Screen
        name={"vehicular/vehicularS"}
        options={{
          // headerShown: false
          title: "Registrar Salida Vehicular",
        }}
      />
    </Stack>
  );
};

export default InspectorLayout;
