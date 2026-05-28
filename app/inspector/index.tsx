import { Colors } from "@/constants/Colors";
import { BookSearchIcon, CarLeftIcon, CarRightIcon } from "@/constants/Icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import ButtonOption from "@/presentation/components/menu/ButtonOption";
import ThemedView from "@/presentation/shared/ThemedView";
import React from "react";
import { View } from "react-native";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const themeDark = useColorScheme() === "dark";
  const opciones = [
    {
      name: "Inspecciones Pendientes",
      color: themeDark ? Colors.dark.primary : Colors.light.primary,
      icon: <BookSearchIcon size={80} />,
      ruta: "/inspector/visita",
    },
    {
      name: "Ingreso Vehicular",
      color: themeDark ? Colors.dark.success : Colors.light.success,
      icon: <CarLeftIcon size={80} />,
      ruta: "/inspector/vehicular/vehicularI",
    },
    {
      name: "Salida Vehicular",
      color: themeDark ? Colors.dark.danger : Colors.light.danger,
      icon: <CarRightIcon size={80} />,
      ruta: "/inspector/vehicular/vehicularS",
    },
  ];
  return (
    <ThemedView className={" items-center gap-y-2 lg:gap-y-5"} >
      {opciones.map((opcion, index) => (
        <View key={index} className={"w-3/4 pt-5 lg:pt-10"}>
          <ButtonOption
            title={opcion.name}
            icon={opcion.icon}
            color={opcion.color}
            ruta={opcion.ruta}
          />
        </View>
      ))}
    </ThemedView>
  );
};

export default index;
