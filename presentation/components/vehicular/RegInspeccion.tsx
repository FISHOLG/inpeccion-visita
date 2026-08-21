import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { ListarVehiculos } from "@/core/services/Vehiculos.service";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import {
  TipoVehiculosPP,
  Vehiculo,
} from "@/infraestructure/interfaces/main.interface";
import { palette } from "@/constants/Colors";
import { CarLeftIcon, CarRightIcon } from "@/constants/Icons";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import ListaVehiculos from "@/presentation/components/vehicular/ListaVehiculos";
import EmptyState from "@/presentation/shared/EmptyState";
import Loader from "@/presentation/shared/Loader";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  tipo: "I" | "S" | null;
}

const RegInspeccion = ({ tipo }: Props) => {
  const [loadingVehiculos, setLoadingVehiculos] = useState<boolean>(false);

  const [listVehiculos, setListVehiculos] = useState<TipoVehiculosPP[]>([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );

  const seleccionarVehiculo = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
  };

  const orientation = useScreenOrientation();
  const isPortrait = orientation === "portrait";
  const numColumns = isPortrait ? 1 : Math.max(1, listVehiculos?.length ?? 1); // --- correcion guardado inspeccion

  const esIngreso = tipo === "I";
  const acento = esIngreso ? palette.success : palette.danger;

  useEffect(() => {
    const listarVehiculosPP = async () => {
      setLoadingVehiculos(true);
      const listaVehiculos = await ListarVehiculos();
      setListVehiculos(listaVehiculos ?? []); // --- correcion guardado inspeccion
      setLoadingVehiculos(false);
    };

    listarVehiculosPP();
  }, []);

  if (loadingVehiculos) return <Loader message="Cargando unidades" />;

  return !selectedVehiculo ? (
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
        <ThemedText type="caption" className="text-white">
          Seleccione una unidad
        </ThemedText>
      </View>

      <FlatList
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 24,
        }}
        columnWrapperStyle={numColumns > 1 ? { gap: 14 } : undefined}
        data={listVehiculos}
        keyExtractor={(item) => item.tipoTrans}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View key={item.tipoTrans} className="flex-grow">
            <ListaVehiculos
              vehiculos={item.vehiculos}
              titulo={item.descTrans}
              seleccionarVehiculo={seleccionarVehiculo}
              tipoInsp={tipo ?? ""}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No hay unidades disponibles"
            description="Vuelva a intentarlo en unos minutos"
          />
        }
      />
    </View>
  ) : (
    <View className="flex-1">
      <FormInspeccion
        tipoIns={tipo ?? ""}
        tipoUnd={selectedVehiculo.tipoTrans}
        placa={selectedVehiculo.numPlaca}
      />
    </View>
  );
};

export default RegInspeccion;
