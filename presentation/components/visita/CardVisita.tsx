import React from "react";
import { View } from "react-native";
import { palette } from "@/constants/Colors";
import {
  CalendarIcon,
  CarLeftIcon,
  CarRightIcon,
  ChevronRightIcon,
  ClipboardListIcon,
} from "@/constants/Icons";
import { VehiculosVisita } from "@/infraestructure/interfaces/main.interface";
import Card from "@/presentation/shared/Card";
import Chip from "@/presentation/shared/Chip";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  vehiculo: VehiculosVisita;
  seleccionarVehiculo: (data: VehiculosVisita) => void;
}

const Placa = ({ valor }: { valor: string }) => (
  <View className="rounded-md border-2 border-app-textMain bg-white px-3 py-1">
    <ThemedText type="plate" className="text-app-textMain">
      {valor}
    </ThemedText>
  </View>
);

const CardVisita = ({ vehiculo, seleccionarVehiculo }: Props) => {
  const esIngreso = vehiculo.tipoInspeccion === "I";
  const acento = esIngreso ? palette.success : palette.danger;

  return (
    <Card
      onPress={() => seleccionarVehiculo(vehiculo)}
      accentColor={acento}
      level={2}
      className="mb-4 flex-grow"
    >
      <View className="gap-y-3 px-4 py-4">
        <View className="flex-row items-center gap-x-2">
          <View
            className="h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: acento }}
          >
            {esIngreso ? (
              <CarLeftIcon size={24} color={palette.onPrimary} />
            ) : (
              <CarRightIcon size={24} color={palette.onPrimary} />
            )}
          </View>

          <View className="flex-1">
            <Chip
              label={esIngreso ? "Ingreso" : "Salida"}
              tone={esIngreso ? "success" : "danger"}
            />
          </View>

          <ChevronRightIcon size={26} />
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          <Placa valor={vehiculo.placa1} />
          {vehiculo.placa2 ? <Placa valor={vehiculo.placa2} /> : null}
        </View>

        <ThemedText
          type="h4"
          className="uppercase text-app-textSecond"
          numberOfLines={2}
        >
          {vehiculo.modelo}
        </ThemedText>

        <View className="h-px bg-app-border" />

        <View className="flex-row items-center justify-between gap-x-3">
          <View className="flex-row items-center gap-x-1.5">
            <ClipboardListIcon size={16} color={palette.textMuted} />
            <ThemedText type="caption" className="uppercase text-app-textMuted">
              Visita {vehiculo.codIngreso}
            </ThemedText>
          </View>

          <View className="flex-row items-center gap-x-1.5">
            <CalendarIcon size={16} color={palette.textMuted} />
            <ThemedText type="caption" className="text-app-textMuted">
              {vehiculo.fechaIngreso}
            </ThemedText>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default CardVisita;
