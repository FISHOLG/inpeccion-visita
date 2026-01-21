import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator,FlatList } from "react-native";
import { useVehiculos } from "@/presentation/hooks/useVehiculos";
import {
  TipoVehiculosPP,
  Vehiculo,
} from "@/infraestructure/interfaces/main.interface";
import ListaVehiculos from "@/presentation/components/vehicular/ListaVehiculos";
import ThemedText from "@/presentation/shared/ThemedText";
import FormInspeccion from "@/presentation/components/inspeccion/FormInspeccion";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";
import { ListarVehiculos } from "@/core/services/Vehiculos.service";

interface Props {
  tipo: "I" | "S"|null;
}

const RegInspeccion = ({ tipo }: Props) => {
  //const { ListVehiculos } = useVehiculos();
    const [loadingVehiculos, setLoadingVehiculos] = useState<boolean>(false);

  const [listVehiculos, setListVehiculos] = useState<TipoVehiculosPP[]>([]);
  // const [listVehiculosT, setListVehiculosT] = useState<Vehiculo[]>([]);
  // const [listVehiculosP, setListVehiculosP] = useState<Vehiculo[]>([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(
    null,
  );

  const seleccionarVehiculo = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
  };
    const orientation = useScreenOrientation();
    const isPortrait = orientation === 'portrait';
    const numColumns = isPortrait ? 1 : listVehiculos.length;

 /* useEffect(() => {
    if (!ListVehiculos.isLoading && ListVehiculos.data) {
      /!*const { T, P } = ListVehiculos.data.reduce(
        (acc: { T: Vehiculo[]; P: Vehiculo[] }, v: Vehiculo) => {
          if (v.tipoTrans === "1" || v.tipoTrans === "5") acc.P.push(v);
          else acc.T.push(v);
          return acc;
        },
        { T: [], P: [] },
      );

      setListVehiculosT(T);
      setListVehiculosP(P);*!/
       // const vehiculosOrdenados = [...ListVehiculos.data].sort((a, b) => a.vehiculos.length - b.vehiculos.length);
        setListVehiculos(ListVehiculos.data)
    }
  }, [ListVehiculos.isLoading, ListVehiculos.data]);*/


    useEffect(() => {
        const listarVehiculosPP= async()=>
        {
            setLoadingVehiculos(true);
            const listaVehiculos = await ListarVehiculos();
            setListVehiculos(listaVehiculos)
            setLoadingVehiculos(false);
        }

        listarVehiculosPP()
    }, []);

  if (loadingVehiculos)//ListVehiculos.isLoading
    return (
      <View className="justify-center items-center flex-1">
        <ActivityIndicator color="gray" size={40} />
      </View>
    );

  return !selectedVehiculo ? (
    /*<View className="flex-row flex-1 pt-5">
      <View className="w-1/2 px-4">
        <ListaVehiculos
          vehiculos={listVehiculosT}
          titulo="Transporte de Personal"
          seleccionarVehiculo={seleccionarVehiculo}
        />
      </View>
      <View className="w-1/2 px-4">
        <ListaVehiculos
          vehiculos={listVehiculosP}
          titulo="Particulares"
          seleccionarVehiculo={seleccionarVehiculo}
        />
      </View>
    </View>*/
    /*<View className={'lg:flex-row flex-1 pt-5 '}>


        {listVehiculos.map((tipos)=>(

            <View key={tipos.tipoTrans} className=" px-4">
                <ListaVehiculos
                    vehiculos={tipos.vehiculos}
                    titulo={tipos.descTrans}
                    seleccionarVehiculo={seleccionarVehiculo}
                />
            </View>


        ))}

        </View>
        */

    <View className={'flex-1'}>
        <FlatList
            key={numColumns}
            numColumns={numColumns}
            contentContainerStyle={{
                paddingTop:20
            }}
            columnWrapperStyle={numColumns > 1 ? { gap:20} : undefined}
            data={listVehiculos}
            keyExtractor={(item) => item.tipoTrans}
            renderItem={({item})=>(
                <View key={item.tipoTrans} className="flex-1">
                    <ListaVehiculos
                        vehiculos={item.vehiculos}
                        titulo={item.descTrans}
                        seleccionarVehiculo={seleccionarVehiculo}
                        tipoInsp={tipo??''}
                    />
                </View>
            )}

        />
    </View>



  ) : (
    <View className={"flex-1 p-5"}>
      <FormInspeccion
        tipoIns={tipo??''}
        tipoUnd={selectedVehiculo.tipoTrans}
        placa={selectedVehiculo.numPlaca}
      />
    </View>
  );
};

export default RegInspeccion;
