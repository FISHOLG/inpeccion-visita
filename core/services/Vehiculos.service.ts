import { inspeccionApi } from "@/core/api/inspeccion-api";
import { VehiculoMapper } from "@/infraestructure/mappers/vehiculos.mapper";



export const ListarVehiculos = async () => {
    const url = "/vehiculos";
  try {
    const peticion = await inspeccionApi.get(url);

    const { data } = peticion.data;


      return data.map(VehiculoMapper.FromVehiculoDbToVehiculo);


  } catch (error) {
      console.log(error)
  }
};


export const ListarVehiculosVisita = async () => {
    const url = "/vehiculosvisita";
    try {
        const peticion = await inspeccionApi.get(url);

        const { data } = peticion.data;

        return data.map(VehiculoMapper.FromVahiculosViDBtoVahiculosVisita);
    } catch (error) {}
};
