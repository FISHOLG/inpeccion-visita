import { CarIcon } from "@/constants/Icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { VehiculosVisita } from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import React from "react";
import { Pressable, View } from "react-native";

interface Props {
  vehiculo: VehiculosVisita;
  seleccionarVehiculo: (data: VehiculosVisita) => void;
}

const CardVisita = ({ vehiculo, seleccionarVehiculo }: Props) => {
  const iconColor = useThemeColor({}, "textMain");

  return (
    <Pressable
      onPress={() => seleccionarVehiculo(vehiculo)}
      className={`flex-grow flex-row gap-x-8 mb-5 p-5  rounded-2xl active:opacity-60 ${vehiculo.tipoInspeccion === "I" ? "bg-light-success dark:bg-dark-success" : "bg-light-danger dark:bg-dark-danger"}`}
    >
      <View className={"justify-center items-center gap-y-3 w-1/4"}>
        <CarIcon color={iconColor} size={45} />
        <ThemedText type={"h1"}>{vehiculo.placa1}</ThemedText>
        {vehiculo.placa2 && (
          <ThemedText type={"h1"}>{vehiculo.placa2}</ThemedText>
        )}
      </View>

      <View className={"flex-1 justify-between gap-8"}>
        <View className={"justify-end gap-x-5 items-end"}>
          <ThemedText type={"semi-bold"} className={"uppercase "}>
            # Visita {vehiculo.codIngreso}
          </ThemedText>
          <ThemedText type={"semi-bold"} className={"uppercase "}>
            {" "}
            {vehiculo.fechaIngreso}
          </ThemedText>
        </View>
        <ThemedText type={"h1"} className={" uppercase"}>
          {vehiculo.modelo}
        </ThemedText>
        <ThemedText
          type={"h2"}
          className={
            "uppercase text-right text-light-textMain dark:text-dark-textMain"
          }
        >
          {" "}
          {vehiculo.tipoInspeccion === "I" ? "Ingreso" : "Salida"}
        </ThemedText>
      </View>
    </Pressable>
  );
};

export default CardVisita;
