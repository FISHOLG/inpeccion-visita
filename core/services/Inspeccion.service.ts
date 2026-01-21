import { inspeccionApi } from "@/core/api/inspeccion-api";
import { InspeccionMapper } from "@/infraestructure/mappers/inspeccion.mapper";
import { FormInspecc } from "@/infraestructure/interfaces/main.interface";

const url = "/inspeccion";

export const obtenerPreguntas = async (codUnidad: string) => {
  try {
    const peticion = await inspeccionApi.get(`${url}/${codUnidad}`);

    const { data } = peticion.data;

    return data.map(
      InspeccionMapper.FromInspeccionDataResponsetoPreguntaInspeccion,
    );
  } catch (error) {
    console.log(error);
  }
};

export const guardarInspeccion = async (datos: FormInspecc) => {
  try {
    const peticion = await inspeccionApi.post(url, datos);

    const { data } = peticion;

    return data;
  } catch (error: any) {
    let message: string;

    if (error.code && error.code === "ERR_NETWORK") {
      message = error.message + ":" + JSON.stringify(error);
    } else if (error.response) {
      message = error.response.data.error;
    } else if (error.request) {
      message = error.message;
    } else {
      message = error;
    }

    return { error: message.toString() };
  }
};
