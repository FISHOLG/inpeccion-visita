import React from "react";
import { ScrollView, View } from "react-native";
import { palette } from "@/constants/Colors";
import {
  BookSearchIcon,
  CarLeftIcon,
  CarRightIcon,
  ShieldCheckIcon,
} from "@/constants/Icons";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import ButtonOption from "@/presentation/components/menu/ButtonOption";
import ThemedText from "@/presentation/shared/ThemedText";
import ThemedView from "@/presentation/shared/ThemedView";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { auth } = useAuthContext();

  const opciones = [
    {
      name: "Inspecciones Pendientes",
      detalle: "Unidades en visita por revisar",
      color: palette.primary,
      icon: <ShieldCheckIcon size={34} color={palette.onPrimary} />,
      ruta: "/inspector/visita",
    },
    {
      name: "Ingreso Vehicular",
      detalle: "Registrar unidad que entra a planta",
      color: palette.success,
      icon: <CarLeftIcon size={34} color={palette.onPrimary} />,
      ruta: "/inspector/vehicular/vehicularI",
    },
    {
      name: "Salida Vehicular",
      detalle: "Registrar unidad que sale de planta",
      color: palette.danger,
      icon: <CarRightIcon size={34} color={palette.onPrimary} />,
      ruta: "/inspector/vehicular/vehicularS",
    },
  ];

  return (
    <ThemedView safeb>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-x-3 py-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-app-primarySoft">
            <BookSearchIcon size={26} color={palette.primary} />
          </View>
          <View className="flex-1">
            <ThemedText type="label" className="text-app-textMuted">
              Panel del inspector
            </ThemedText>
            <ThemedText type="h3" className="text-app-textMain" numberOfLines={1}>
              {auth?.nombrUsr ?? "Inspector"}
            </ThemedText>
          </View>
        </View>

        <View className="mb-3 h-px bg-app-border" />

        <ThemedText type="label" className="mb-3 text-app-textSecond">
          ¿Que desea registrar?
        </ThemedText>

        <View className="gap-y-4">
          {opciones.map((opcion, i) => (
            <ButtonOption
              key={i}
              title={opcion.name}
              subtitle={opcion.detalle}
              icon={opcion.icon}
              color={opcion.color}
              ruta={opcion.ruta}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default index;
