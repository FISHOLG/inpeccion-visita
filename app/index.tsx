import { useAuthContext } from "@/core/stores/AuthContext.store";
import { Href, Redirect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { View } from "react-native";
import { BrandMark } from "@/constants/Icons";
import Loader from "@/presentation/shared/Loader";
import ThemedText from "@/presentation/shared/ThemedText";

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
      <View className="flex-1 bg-app-background">
        <View className="flex-1 items-center justify-end gap-y-4 pb-6">
          <BrandMark size={88} />
          <ThemedText type="h2" className="uppercase text-app-primaryDeep">
            Inspeccion Vehicular
          </ThemedText>
        </View>
        <View className="flex-1">
          <Loader message="Verificando sesion" />
        </View>
      </View>
    );

  if (!stateAuth) return <Redirect href="/login" />;

  return <Redirect href={"/inspector" as Href} />;
};

export default index;
