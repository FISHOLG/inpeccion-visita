import React from "react";
import { View, Text, FlatList } from "react-native";
import { Vehiculo } from "@/infraestructure/interfaces/main.interface";
import CardVehiculo from "@/presentation/components/vehicular/CardVehiculo";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  vehiculos: Vehiculo[];
  titulo: string;
  seleccionarVehiculo: (data: Vehiculo) => void;
  tipoInsp: string;
}

const ListaVehiculos = ({ vehiculos, titulo, seleccionarVehiculo,tipoInsp }: Props) => {
  return (
    <>
      <ThemedText
        type={"h2"}
        className={
          "text-center text-light-textMain dark:text-dark-textMain pb-5"
        }
      >
        {titulo}
      </ThemedText>
      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.numPlaca}
        renderItem={({ item }) => (
          <CardVehiculo
            vehiculo={item}
            seleccionarVehiculo={seleccionarVehiculo}
            tipoInsp={tipoInsp}
          />
        )}
      />
    </>
  );
};

export default ListaVehiculos;
