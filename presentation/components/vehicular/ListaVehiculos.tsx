import React from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { palette } from "@/constants/Colors";
import { VanIcon } from "@/constants/Icons";
import { Vehiculo } from "@/infraestructure/interfaces/main.interface";
import CardVehiculo from "@/presentation/components/vehicular/CardVehiculo";
import EmptyState from "@/presentation/shared/EmptyState";
import ThemedText from "@/presentation/shared/ThemedText";

interface PropsEncabezado {
  titulo: string;
  cantidad: number;
}

export const EncabezadoGrupo = React.memo(
  ({ titulo, cantidad }: PropsEncabezado) => (
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
          {cantidad}
        </ThemedText>
      </View>
    </View>
  ),
);
EncabezadoGrupo.displayName = "EncabezadoGrupo";

interface Props {
  vehiculos: Vehiculo[];
  titulo: string;
  seleccionarVehiculo: (data: Vehiculo) => void;
  tipoInsp: string;
}

const vacio = <EmptyState title="Sin unidades en este grupo" />;

const ListaVehiculos = ({
  vehiculos,
  titulo,
  seleccionarVehiculo,
  tipoInsp,
}: Props) => {
  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<Vehiculo>) => (
      <CardVehiculo
        vehiculo={item}
        seleccionarVehiculo={seleccionarVehiculo}
        tipoInsp={tipoInsp}
      />
    ),
    [seleccionarVehiculo, tipoInsp],
  );

  const keyExtractor = React.useCallback(
    (item: Vehiculo) => item.numPlaca,
    [],
  );

  return (
    <>
      <EncabezadoGrupo titulo={titulo} cantidad={vehiculos.length} />

      <FlatList
        data={vehiculos}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={vacio}
      />
    </>
  );
};

export default React.memo(ListaVehiculos);
