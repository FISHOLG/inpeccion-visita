import { useQuery } from "@tanstack/react-query";
import { ListarVehiculos } from "@/core/services/Vehiculos.service";
import { obtenerPreguntas } from "@/core/services/Inspeccion.service";

export const useDataInspeccion = (codUnidad: string) => {
  const ListPreguntas = useQuery({
    queryKey: ["inspeccion", codUnidad],
    queryFn: () => obtenerPreguntas(codUnidad),
    staleTime: 1000 * 60 * 60 * 24, //24H
  });

  return {
    ListPreguntas,
  };
};
