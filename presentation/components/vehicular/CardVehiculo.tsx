import React from "react";
import { View } from "react-native";
import { palette } from "@/constants/Colors";
import {
  CarLeftIcon,
  CarRightIcon,
  ChevronRightIcon,
} from "@/constants/Icons";
import { Vehiculo } from "@/infraestructure/interfaces/main.interface";
import Card from "@/presentation/shared/Card";
import Chip from "@/presentation/shared/Chip";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  vehiculo: Vehiculo;
  seleccionarVehiculo: (data: Vehiculo) => void;
  tipoInsp: string;
}

const CardVehiculo = ({ vehiculo, seleccionarVehiculo, tipoInsp }: Props) => {
  const pendienteSalida = vehiculo.tipoUltInsp === "I";

  const habilitado = vehiculo.tipoUltInsp !== tipoInsp;

  const acento = !habilitado
    ? palette.borderStrong
    : pendienteSalida
      ? palette.accent
      : palette.primary;

  const fondo = !habilitado
    ? "bg-app-surfaceAlt"
    : pendienteSalida
      ? "bg-app-accentSoft"
      : "";

  return (
    <Card
      onPress={() => seleccionarVehiculo(vehiculo)}
      disabled={!habilitado}
      accentColor={acento}
      level={habilitado ? 2 : 0}
      className={`mb-4 ${fondo}`}
    >
      <View className="flex-row items-center gap-x-4 px-4 py-4">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: acento }}
        >
          {pendienteSalida ? (
            <CarRightIcon size={28} color={palette.onPrimary} />
          ) : (
            <CarLeftIcon size={28} color={palette.onPrimary} />
          )}
        </View>

        <View className="flex-1 gap-y-2">
          <View className="self-start rounded-md border-2 border-app-textMain bg-white px-2.5 py-0.5">
            <ThemedText type="plate" className="text-app-textMain">
              {vehiculo.numPlaca}
            </ThemedText>
          </View>

          <ThemedText
            type="semi-bold"
            numberOfLines={2}
            className="uppercase text-app-textSecond"
          >
            {vehiculo.propietario}
          </ThemedText>

          {pendienteSalida ? (
            <Chip label="Pendiente de salida" tone="warning" />
          ) : (
            <Chip label="Pendiente de ingreso" tone="primary" />
          )}
        </View>

        {habilitado ? <ChevronRightIcon size={26} /> : null}
      </View>
    </Card>
  );
};

export default CardVehiculo;
