import React from "react";
import { View, Pressable } from "react-native";
import { Vehiculo } from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { CarIcon } from "@/constants/Icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  vehiculo: Vehiculo;
  seleccionarVehiculo: (data: Vehiculo) => void;
    tipoInsp:string
}

const CardVehiculo = ({ vehiculo, seleccionarVehiculo,tipoInsp }: Props) => {
  const iconColor = useThemeColor({}, "textMain");
  return (
    <Pressable
      onPress={() => seleccionarVehiculo(vehiculo)}
      disabled={vehiculo.tipoUltInsp===tipoInsp}
      className={
        "flex-row gap-x-8 items-center mb-5 p-5  rounded-2xl active:opacity-60 " +
          `${vehiculo.tipoUltInsp===tipoInsp ?' bg-gray-400/70 cursor-not-allowed': tipoInsp==='S' &&vehiculo.tipoUltInsp==='I' ? 'bg-amber-500/70':'bg-light-secondary' +
              ' dark:bg-dark-secondary cursor-pointer'}`
      }
    >
      <View className={"justify-center items-center gap-y-3"}>
        <CarIcon color={iconColor} size={45} />
        <ThemedText type={"h3"}>{vehiculo.numPlaca}</ThemedText>
      </View>

      <ThemedText numberOfLines={2} type={"h2"} className={"flex-grow uppercase"}>
        {vehiculo.propietario}
      </ThemedText>
    </Pressable>
  );
};

export default CardVehiculo;
