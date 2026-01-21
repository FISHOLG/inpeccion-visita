import { useQuery } from "@tanstack/react-query";
import { ListarVehiculos } from "@/core/services/Vehiculos.service";

export const useVehiculos = () => {
  const ListVehiculos = useQuery({
    queryKey: ["vehiculos", "list"],
    queryFn: ListarVehiculos,
    staleTime: 1000 * 60 * 60 * 24, //24H
  });

  return {
    ListVehiculos,
  };
};
