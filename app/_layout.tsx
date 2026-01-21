import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/core/stores/AuthContext.store";
import ToastManager from "toastify-react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>


          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login/index" />
            <Stack.Screen name="inspector" />
            <Stack.Screen name="+not-found" />
          </Stack>
            <ToastManager
                theme={colorScheme==="dark"?"dark":"light"}
                position="top"
                textStyle={
                    {
                        fontSize:30
                    }
                }
                width={'80%'}
                animationStyle={'fade'}
                iconSize={35}
            />
          <StatusBar style="auto" />

      </ThemeProvider>
        </AuthProvider>
    </QueryClientProvider>
  );
}
