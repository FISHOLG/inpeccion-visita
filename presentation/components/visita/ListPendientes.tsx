import { palette } from "@/constants/Colors";
import { ClipboardListIcon, ReloadIcon } from "@/constants/Icons";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { VehiculosVisita } from "@/infraestructure/interfaces/main.interface";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import CardVisita from "@/presentation/components/visita/CardVisita";
import { useVehiculosVisita } from "@/presentation/hooks/useVehiculosVisita";
import EmptyState from "@/presentation/shared/EmptyState";
import Loader from "@/presentation/shared/Loader";
import ThemedText from "@/presentation/shared/ThemedText";
import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";

const CONTENIDO = { padding: 14, paddingBottom: 24 };
const COLUMNAS = { gap: 14 };
const SIN_DATOS: VehiculosVisita[] = [];
const VACIO = (
  <EmptyState
    title="No hay inspecciones pendientes"
    description="Deslice hacia abajo para actualizar la lista"
  />
);

const ListPendientes = () => {
  const { ListVehiculosVisita } = useVehiculosVisita();
  const { refetch } = ListVehiculosVisita;

  const vehiculosPendientes = ListVehiculosVisita.data ?? SIN_DATOS;

  const [selectedVehiculo, setSelectedVehiculo] =
    useState<VehiculosVisita | null>(null);

  const seleccionarVehiculo = useCallback((vehiculo: VehiculosVisita) => {
    setSelectedVehiculo(vehiculo);
  }, []);

  const orientation = useScreenOrientation();
  const isPortrait = orientation === "portrait";
  const numColumns = isPortrait ? 1 : 3;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<VehiculosVisita>) => (
      <CardVisita vehiculo={item} seleccionarVehiculo={seleccionarVehiculo} />
    ),
    [seleccionarVehiculo],
  );

  const keyExtractor = useCallback(
    (item: VehiculosVisita) => `${item.codIngreso}-${item.itemIngreso}`,
    [],
  );

  const refrescar = useCallback(() => {
    refetch();
  }, [refetch]);

  if (selectedVehiculo)
    return (
      <View className="flex-1">
        <FormInspeccion
          tipoIns={selectedVehiculo.tipoInspeccion}
          tipoUnd={selectedVehiculo.codUnd}
          codInsp={selectedVehiculo.codIngreso}
          itemInsp={selectedVehiculo.itemIngreso}
          dobleRevision={selectedVehiculo.dobleRevision}
          codInspReabrir={selectedVehiculo.codInspIngreso}
        />
      </View>
    );

  if (ListVehiculosVisita.isLoading && vehiculosPendientes.length === 0)
    return <Loader message="Cargando pendientes" />;

  return (
    <>
      <View className="flex-row items-center gap-x-3 border-b border-app-border bg-app-surface px-4 py-4">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-app-primarySoft">
          <ClipboardListIcon size={24} color={palette.primary} />
        </View>

        <View className="flex-1">
          <ThemedText type="label" className="text-app-textMuted">
            Pendientes de inspeccion
          </ThemedText>
          <ThemedText type="h4" className="text-app-textMain">
            {vehiculosPendientes.length}{" "}
            {vehiculosPendientes.length === 1 ? "unidad" : "unidades"} en cola
          </ThemedText>
        </View>

        <ReloadIcon size={24} onPress={refrescar} />
      </View>

      <View className="flex-1">
        <FlatList
          key={numColumns}
          data={vehiculosPendientes}
          numColumns={numColumns}
          keyExtractor={keyExtractor}
          contentContainerStyle={CONTENIDO}
          columnWrapperStyle={numColumns > 1 ? COLUMNAS : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          refreshing={ListVehiculosVisita.isFetching}
          onRefresh={refrescar}
          ListEmptyComponent={VACIO}
        />
      </View>
    </>
  );
};

export default ListPendientes;
