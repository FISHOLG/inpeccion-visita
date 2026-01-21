import React, {useState,useEffect} from 'react';
import { View, FlatList } from 'react-native';
import { ListarVehiculosVisita } from "@/core/services/Vehiculos.service";
import {
  VehiculosVisita,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import CardVisita from "@/presentation/components/visita/CardVisita";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";

const ListPendientes = () => {

    const [vehiculosPendientes, setVehiculosPendientes] = useState<VehiculosVisita[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const orientation = useScreenOrientation();

    const obtenerVehiculosPendientes = async() => {
        setRefreshing(true);
        const peticion= await ListarVehiculosVisita()
        setVehiculosPendientes(peticion)
        setRefreshing(false);
    }

    const [selectedVehiculo, setSelectedVehiculo] = useState<VehiculosVisita | null>(
        null,
    );

    const seleccionarVehiculo = (vehiculo: VehiculosVisita) => {
        setSelectedVehiculo(vehiculo);
    };

    const isPortrait = orientation === 'portrait';
    const numColumns = isPortrait ? 1 : 3;

    useEffect(() => {
        obtenerVehiculosPendientes()
    }, []);

  return !selectedVehiculo?(
      <>
      <ThemedText  type={"h2"}
                   className={
                       "text-center uppercase text-light-textMain dark:text-dark-textMain py-4"
                   }>Vehiculos Pendiente de Inspeccion ({vehiculosPendientes.length})</ThemedText>
          <View className={'flex-1'}>
              <FlatList
                  key={numColumns}
                  data={vehiculosPendientes}
                  numColumns={numColumns}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ padding: 10 }}
                  columnWrapperStyle={numColumns > 1 ? { gap:20} : undefined}
                  renderItem={({ item }) => <CardVisita vehiculo={item} seleccionarVehiculo={seleccionarVehiculo}/>}
                  refreshing={refreshing}
                  onRefresh={obtenerVehiculosPendientes}
                  ListEmptyComponent={
                      <View className={'justify-center items-center '}>
                          <ThemedText type={'h4'} className={'uppercase'}>No hay inspecciones pendientes</ThemedText>
                      </View>
                  }
              />
          </View>
      </>

  ):(
      <View className={"flex-1 p-5"}>
          <FormInspeccion
              tipoIns={selectedVehiculo.tipoInspeccion}
              tipoUnd={selectedVehiculo.codUnd}
             codInsp={selectedVehiculo.codIngreso}
              itemInsp={selectedVehiculo.itemIngreso}
          />
      </View>
  )
};

export default ListPendientes;