import { useQuery } from "@tanstack/react-query";
import { obtenerPreguntas } from "@/core/services/Inspeccion.service";

export const clavePreguntas = (codUnidad: string) =>
  ["inspeccion", codUnidad] as const;

export const useDataInspeccion = (codUnidad: string) => {
  const ListPreguntas = useQuery({
    queryKey: clavePreguntas(codUnidad),
    queryFn: () => obtenerPreguntas(codUnidad),
    enabled: !!codUnidad,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    ListPreguntas,
  };
};
