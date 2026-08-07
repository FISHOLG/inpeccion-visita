import { inspeccionApi } from "@/core/api/inspeccion-api";
import { InspeccionMapper } from "@/infraestructure/mappers/inspeccion.mapper";
import { FormInspecc } from "@/infraestructure/interfaces/main.interface";

const url = "/inspeccion";

export const obtenerPreguntas = async (codUnidad: string) => {
  try {
    const peticion = await inspeccionApi.get(`${url}/${codUnidad}`);

    const { data } = peticion.data;

    // --- correcion guardado inspeccion
    return Array.isArray(data)
      ? data.map(InspeccionMapper.FromInspeccionDataResponsetoPreguntaInspeccion)
      : [];
  } catch (error) {
    console.log(error);
    return []; // --- correcion guardado inspeccion
  }
};

export const guardarInspeccion = async (datos: FormInspecc) => {
  try {
    const peticion = await inspeccionApi.post(url, datos);

    const { data } = peticion;

    return data;
  } catch (error: any) {
    // --- correcion guardado inspeccion
    let message: unknown;

    if (error?.code === "ERR_NETWORK") {
      message = "SIN CONEXION CON EL SERVIDOR";
    } else if (error?.response) {
      const resp = error.response.data;
      message =
        (typeof resp === "object" ? resp?.error : undefined) ??
        (typeof resp === "string" ? resp.slice(0, 300) : undefined) ??
        `ERROR ${error.response.status}`;
    } else if (error?.request) {
      message = error.message;
    } else {
      message = error?.message ?? error;
    }

    return { error: String(message ?? "ERROR DESCONOCIDO") };
  }
};
