import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useEffect } from "react";
//import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import "react-native-reanimated";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

import "./global.css";
import { palette } from "@/constants/Colors";
import { AuthProvider } from "@/core/stores/AuthContext.store";
import ToastManager from "toastify-react-native";

const AppNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.navbar,
    text: palette.textMain,
    border: palette.border,
    notification: palette.accent,
  },
};

export default function RootLayout() {
  /*const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }*/

  const queryClient = new QueryClient();

  useEffect(() => {
    async function checkUpdate() {
      // Solo ejecutar si no estamos en modo desarrollo
      if (!__DEV__) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        } catch (error) {
          console.log("Error al buscar actualizaciones:", error);
        }
      } else {
        console.log("Modo desarrollo: no se buscan actualizaciones");
      }
    }

    checkUpdate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Inspeccion Vehicular App</title>
      </Head>
      <AuthProvider>
        <ThemeProvider value={AppNavTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.background },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login/index" />
            <Stack.Screen name="inspector" />
            <Stack.Screen name="+not-found" />
          </Stack>

          <ToastManager
            theme={"light"}
            position="top"
            textStyle={{
              fontSize: 16,
              fontWeight: "600",
              color: palette.textMain,
            }}
            width={"90%"}
            animationStyle={"fade"}
            iconSize={28}
          />

          <StatusBar style="light" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
