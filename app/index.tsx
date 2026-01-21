import { useAuthContext } from "@/core/stores/AuthContext.store";
import { Href, Redirect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { stateAuth, loading } = useAuthContext();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const unlockOrientation = async () => {
      try {
        await ScreenOrientation.unlockAsync();
      } catch (error) {
        console.error("Error al desbloquear la orientación:", error);
      }
    };

    unlockOrientation();

    return () => {
      // Bloquear orientación si es necesario
      // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (!stateAuth) return <Redirect href="/login" />;

  return <Redirect href={"/inspector" as Href} />;
};

export default index;
