import { DataInspeccionResponse } from "@/infraestructure/interfaces/InpeccionData.interface";
import {
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import { TipoCampoType,CategPreguntaType,TipoPreguntaType } from "@/infraestructure/types/main.type";

export class InspeccionMapper {
  static FromInspeccionDataResponsetoPreguntaInspeccion = (
    data: DataInspeccionResponse,
  ): PreguntaInspeccion => {
    return {
      codigo: data.COD_INSPEC,
      descripcion: data.DESCRIPCION ?? "",
      tipoCampo: (data.TIPO_CAMPO as TipoCampoType) ?? "V",
      categoriaPregunta: (data.FLAG_INSP_UNID as CategPreguntaType) ?? "U",
      tipoPregunta: (data.FLAG_TIPO_INSP as TipoPreguntaType) ?? "A",
    };
  };
}
