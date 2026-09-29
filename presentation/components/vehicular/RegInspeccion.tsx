import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from "react-native";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import {
  TipoVehiculosPP,
  Vehiculo,
} from "@/infraestructure/interfaces/main.interface";
import { palette } from "@/constants/Colors";
import { CarLeftIcon, CarRightIcon } from "@/constants/Icons";
import CardVehiculo from "@/presentation/components/vehicular/CardVehiculo";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import ListaVehiculos, {
  EncabezadoGrupo,
} from "@/presentation/components/vehicular/ListaVehiculos";
import { useVehiculos } from "@/presentation/hooks/useVehiculos";
import EmptyState from "@/presentation/shared/EmptyState";
import Loader from "@/presentation/shared/Loader";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  tipo: "I" | "S" | null;
}

type FilaLista =
  | { clase: "grupo"; llave: string; titulo: string; cantidad: number }
  | { clase: "unidad"; llave: string; vehiculo: Vehiculo };

const CONTENIDO = { padding: 14, paddingBottom: 24 };
const SIN_DATOS: TipoVehiculosPP[] = [];

const VACIO = (
  <EmptyState
    title="No hay unidades disponibles"
    description="Vuelva a intentarlo en unos minutos"
  />
);

const RegInspeccion = ({ tipo }: Props) => {
  const { ListVehiculos } = useVehiculos();

  const listVehiculos = ListVehiculos.data ?? SIN_DATOS;

  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );

  const seleccionarVehiculo = useCallback((vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
  }, []);

  const orientation = useScreenOrientation();
  const isPortrait = orientation === "portrait";

  const esIngreso = tipo === "I";
  const acento = esIngreso ? palette.success : palette.danger;
  const tipoInsp = tipo ?? "";

  const filas = useMemo<FilaLista[]>(() => {
    const acc: FilaLista[] = [];

    listVehiculos.forEach((grupo) => {
      acc.push({
        clase: "grupo",
        llave: `g-${grupo.tipoTrans}`,
        titulo: grupo.descTrans,
        cantidad: grupo.vehiculos.length,
      });

      grupo.vehiculos.forEach((vehiculo) => {
        acc.push({
          clase: "unidad",
          llave: `u-${grupo.tipoTrans}-${vehiculo.numPlaca}`,
          vehiculo,
        });
      });
    });

    return acc;
  }, [listVehiculos]);

  const renderFila = useCallback(
    ({ item }: ListRenderItemInfo<FilaLista>) =>
      item.clase === "grupo" ? (
        <EncabezadoGrupo titulo={item.titulo} cantidad={item.cantidad} />
      ) : (
        <CardVehiculo
          vehiculo={item.vehiculo}
          seleccionarVehiculo={seleccionarVehiculo}
          tipoInsp={tipoInsp}
        />
      ),
    [seleccionarVehiculo, tipoInsp],
  );

  const keyExtractor = useCallback((item: FilaLista) => item.llave, []);

  const { refetch } = ListVehiculos;
  const refrescar = useCallback(() => {
    refetch();
  }, [refetch]);

  if (ListVehiculos.isLoading && listVehiculos.length === 0)
    return <Loader message="Cargando unidades" />;

  if (selectedVehiculo)
    return (
      <View className="flex-1">
        <FormInspeccion
          tipoIns={tipoInsp}
          tipoUnd={selectedVehiculo.tipoTrans}
          placa={selectedVehiculo.numPlaca}
        />
      </View>
    );

  return (
    <View className="flex-1">
      <View
        className="flex-row items-center gap-x-3 px-4 py-3"
        style={{ backgroundColor: acento }}
      >
        {esIngreso ? (
          <CarLeftIcon size={24} color={palette.onPrimary} />
        ) : (
          <CarRightIcon size={24} color={palette.onPrimary} />
        )}
        <ThemedText type="h4" className="flex-1 uppercase text-white">
          {esIngreso ? "Registro de ingreso" : "Registro de salida"}
        </ThemedText>
        {ListVehiculos.isFetching ? (
          <ActivityIndicator size="small" color={palette.onPrimary} />
        ) : (
          <ThemedText type="caption" className="text-white">
            Seleccione una unidad
          </ThemedText>
        )}
      </View>

      {isPortrait ? (
        <FlatList
          data={filas}
          keyExtractor={keyExtractor}
          renderItem={renderFila}
          contentContainerStyle={CONTENIDO}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          removeClippedSubviews
          refreshing={ListVehiculos.isFetching}
          onRefresh={refrescar}
          ListEmptyComponent={VACIO}
        />
      ) : (
        <View className="flex-1 flex-row gap-x-4 px-4 pt-4">
          {listVehiculos.length === 0
            ? VACIO
            : listVehiculos.map((grupo) => (
                <View key={grupo.tipoTrans} className="flex-1">
                  <ListaVehiculos
                    vehiculos={grupo.vehiculos}
                    titulo={grupo.descTrans}
                    seleccionarVehiculo={seleccionarVehiculo}
                    tipoInsp={tipoInsp}
                  />
                </View>
              ))}
        </View>
      )}
    </View>
  );
};

export default RegInspeccion;
