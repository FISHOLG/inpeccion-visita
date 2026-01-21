import React from 'react';
import { View, Text, Pressable } from "react-native";
import {
  Vehiculo,
  VehiculosVisita,
} from "@/infraestructure/interfaces/main.interface";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CarIcon } from "@/constants/Icons";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props{
    vehiculo:VehiculosVisita
    seleccionarVehiculo: (data: VehiculosVisita) => void;
}

const CardVisita = ({vehiculo,seleccionarVehiculo}:Props) => {
    const iconColor = useThemeColor({}, "textMain");

  return (
      <Pressable
          onPress={() => seleccionarVehiculo(vehiculo)}
          className={
              "flex-1 flex-row gap-x-8 mb-5 p-5 bg-light-secondary dark:bg-dark-secondary rounded-2xl active:opacity-60"
          }
      >
          <View className={"justify-center items-center gap-y-3 w-1/4"}>
              <CarIcon color={iconColor} size={45} />
              <ThemedText type={"semi-bold"}>{vehiculo.placa1}</ThemedText>
              {vehiculo.placa2 && (
                  <ThemedText type={"semi-bold"}>{vehiculo.placa2}</ThemedText>
              )}
          </View>

         <View className={'flex-1 justify-between gap-8'}>
             <View className={'justify-end gap-x-5 items-end'}>
                 <ThemedText type={'semi-bold'} className={'uppercase '}> {vehiculo.fechaIngreso}</ThemedText>
                 <ThemedText type={'semi-bold'} className={'uppercase '}># Visita {vehiculo.codIngreso}</ThemedText>
             </View>
             <ThemedText type={"h2"} className={" uppercase"}>
                 {vehiculo.modelo}
             </ThemedText>
             <ThemedText type={'semi-bold'} className={'uppercase text-right text-light-textMain dark:text-dark-textMain'}>Tipo de Inspeccion: {vehiculo.tipoInspeccion==='I'?'Ingreso':'Salida'}</ThemedText>
         </View>
      </Pressable>
  );
};

export default CardVisita;