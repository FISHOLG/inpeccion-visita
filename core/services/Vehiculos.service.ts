import { inspeccionApi } from "@/core/api/inspeccion-api";
import { VehiculoMapper } from "@/infraestructure/mappers/vehiculos.mapper";



export const ListarVehiculos = async () => {
    const url = "/vehiculos";
  try {
    const peticion = await inspeccionApi.get(url);

    const { data } = peticion.data;


      return Array.isArray(data) ? data.map(VehiculoMapper.FromVehiculoDbToVehiculo) : []; // --- correcion guardado inspeccion


  } catch (error) {
      console.log(error)
      return []; // --- correcion guardado inspeccion
  }
};


export const ListarVehiculosVisita = async () => {
    const url = "/vehiculosvisita";
    try {
        const peticion = await inspeccionApi.get(url);

        const { data } = peticion.data;

        return Array.isArray(data) ? data.map(VehiculoMapper.FromVahiculosViDBtoVahiculosVisita) : []; // --- correcion guardado inspeccion
    } catch (error) {
        console.log(error);
        return []; // --- correcion guardado inspeccion
    }
};
