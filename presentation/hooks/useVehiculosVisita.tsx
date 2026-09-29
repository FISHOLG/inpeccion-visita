import { QueryClient, useQuery } from "@tanstack/react-query";
import { ListarVehiculosVisita } from "@/core/services/Vehiculos.service";

export const CLAVE_VEHICULOS_VISITA = ["vehiculos", "visita"] as const;

export const useVehiculosVisita = () => {
  const ListVehiculosVisita = useQuery({
    queryKey: CLAVE_VEHICULOS_VISITA,
    queryFn: ListarVehiculosVisita,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    ListVehiculosVisita,
  };
};

export const prefetchVehiculosVisita = (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: CLAVE_VEHICULOS_VISITA,
    queryFn: ListarVehiculosVisita,
    staleTime: 1000 * 30,
  });
