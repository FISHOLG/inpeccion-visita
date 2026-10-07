import { inspeccionApi } from "@/core/api/inspeccion-api";
import {
  DetalleFormInspeccion,
  FormInspecc,
} from "@/infraestructure/interfaces/main.interface";
import { InspeccionMapper } from "@/infraestructure/mappers/inspeccion.mapper";

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

export const obtenerRespuestasParciales = async (
  codInspeccion: string,
): Promise<DetalleFormInspeccion[]> => {
  const peticion = await inspeccionApi.get(
    `${url}/respuestas/${codInspeccion}`,
  );

  const { data } = peticion.data;

  if (!Array.isArray(data)) throw new Error("RESPUESTA INVALIDA");

  return data
    .filter((item) => item.RESPUESTA !== null && item.RESPUESTA !== undefined)
    .map((item) => ({
      codPregunta: String(item.COD_INSPEC),
      respuesta:
        item.TIPO_CAMPO === "C"
          ? item.RESPUESTA === "1"
          : item.TIPO_CAMPO === "B"
            ? {
                uri: item.RESPUESTA.uri,
                extension: item.RESPUESTA.extension,
                mimeType: `image/${item.RESPUESTA.extension}`,
              }
            : String(item.RESPUESTA),
    }));
};

export const guardarInspeccion =async (datos: FormInspecc) => {
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
