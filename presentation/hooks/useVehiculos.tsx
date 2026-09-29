import { QueryClient, useQuery } from "@tanstack/react-query";
import { ListarVehiculos } from "@/core/services/Vehiculos.service";

export const CLAVE_VEHICULOS = ["vehiculos", "list"] as const;

export const useVehiculos = () => {
  const ListVehiculos = useQuery({
    queryKey: CLAVE_VEHICULOS,
    queryFn: ListarVehiculos,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    ListVehiculos,
  };
};

export const prefetchVehiculos = (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: CLAVE_VEHICULOS,
    queryFn: ListarVehiculos,
    staleTime: 1000 * 30,
  });
