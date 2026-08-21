import React from "react";
import { FlatList, View } from "react-native";
import { palette } from "@/constants/Colors";
import { VanIcon } from "@/constants/Icons";
import { Vehiculo } from "@/infraestructure/interfaces/main.interface";
import CardVehiculo from "@/presentation/components/vehicular/CardVehiculo";
import EmptyState from "@/presentation/shared/EmptyState";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  vehiculos: Vehiculo[];
  titulo: string;
  seleccionarVehiculo: (data: Vehiculo) => void;
  tipoInsp: string;
}

const ListaVehiculos = ({
  vehiculos,
  titulo,
  seleccionarVehiculo,
  tipoInsp,
}: Props) => {
  return (
    <>
      <View className="mb-4 flex-row items-center gap-x-3 rounded-2xl border border-app-border bg-app-surface px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-app-primarySoft">
          <VanIcon size={22} color={palette.primary} />
        </View>
        <ThemedText
          type="h4"
          numberOfLines={2}
          className="flex-1 uppercase text-app-textMain"
        >
          {titulo}
        </ThemedText>
        <View className="rounded-full bg-app-surfaceAlt px-3 py-1">
          <ThemedText type="caption" className="text-app-textSecond">
            {vehiculos.length}
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.numPlaca}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CardVehiculo
            vehiculo={item}
            seleccionarVehiculo={seleccionarVehiculo}
            tipoInsp={tipoInsp}
          />
        )}
        ListEmptyComponent={
          <EmptyState title="Sin unidades en este grupo" />
        }
      />
    </>
  );
};

export default ListaVehiculos;
