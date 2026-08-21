import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ListarVehiculosVisita } from "@/core/services/Vehiculos.service";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { VehiculosVisita } from "@/infraestructure/interfaces/main.interface";
import { palette } from "@/constants/Colors";
import { ClipboardListIcon, ReloadIcon } from "@/constants/Icons";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import CardVisita from "@/presentation/components/visita/CardVisita";
import EmptyState from "@/presentation/shared/EmptyState";
import ThemedText from "@/presentation/shared/ThemedText";

const ListPendientes = () => {
  const [vehiculosPendientes, setVehiculosPendientes] = useState<
    VehiculosVisita[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const orientation = useScreenOrientation();

  const obtenerVehiculosPendientes = async () => {
    setRefreshing(true);
    const peticion = await ListarVehiculosVisita();
    setVehiculosPendientes(peticion);
    setRefreshing(false);
  };

  const [selectedVehiculo, setSelectedVehiculo] =
    useState<VehiculosVisita | null>(null);

  const seleccionarVehiculo = (vehiculo: VehiculosVisita) => {
    setSelectedVehiculo(vehiculo);
  };

  const isPortrait = orientation === "portrait";
  const numColumns = isPortrait ? 1 : 3;

  useEffect(() => {
    obtenerVehiculosPendientes();
  }, []);

  return !selectedVehiculo ? (
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

        <ReloadIcon size={24} onPress={obtenerVehiculosPendientes} />
      </View>

      <View className="flex-1">
        <FlatList
          key={numColumns}
          data={vehiculosPendientes}
          numColumns={numColumns}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 14, paddingBottom: 24 }}
          columnWrapperStyle={numColumns > 1 ? { gap: 14 } : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CardVisita
              vehiculo={item}
              seleccionarVehiculo={seleccionarVehiculo}
            />
          )}
          refreshing={refreshing}
          onRefresh={obtenerVehiculosPendientes}
          ListEmptyComponent={
            <EmptyState
              title="No hay inspecciones pendientes"
              description="Deslice hacia abajo para actualizar la lista"
            />
          }
        />
      </View>
    </>
  ) : (
    <View className="flex-1">
      <FormInspeccion
        tipoIns={selectedVehiculo.tipoInspeccion}
        tipoUnd={selectedVehiculo.codUnd}
        codInsp={selectedVehiculo.codIngreso}
        itemInsp={selectedVehiculo.itemIngreso}
      />
    </View>
  );
};

export default ListPendientes;
