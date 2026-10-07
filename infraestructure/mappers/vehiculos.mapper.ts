import {
  TipoVehiculosPP,
  VehiculosVisita,
} from "@/infraestructure/interfaces/main.interface";
import { DataVehiculoResponse } from "@/infraestructure/interfaces/vehiculos.interface";
import { DataVehiVisita } from "@/infraestructure/interfaces/vehiculosVistita.interface";

// modelo_unidad.cod_mod_und de CONTENEDORES: unico con ingreso en dos revisiones
const COD_UND_CONTENEDOR = 4;

export class VehiculoMapper {
  static FromVehiculoDbToVehiculo = (
    item: DataVehiculoResponse,
  ): TipoVehiculosPP => {
    return {
      tipoTrans: item.COD_UND,
      descTrans: item.TIPO_UNIDAD,
      vehiculos: item.VEHICULOS.map((v) => ({
        numPlaca: v.NUM_PLACA,
        propietario: v.PROPIETARIO,
        tipoTrans: item.COD_UND,
        tipoUltInsp: v.TIPO_ULT_INSP,
      })),
    };
  };

  static FromVahiculosViDBtoVahiculosVisita = (
    data: DataVehiVisita,
  ): VehiculosVisita => {
    const ingresoParcial =
      !!data.COD_INPS_ING && data.ESTADO_INSP_ING === "P";

    const tipoInspeccion = !data.COD_INPS_ING || ingresoParcial ? "I" : "S";

    return {
      codIngreso: data.COD_INGRESO,
      itemIngreso: data.ITEM_ING,
      codUnd: data.COD_MOD_UND,
      fechaIngreso: data.FECHA_INGRESO,
      placa1: data.PLACA1,
      placa2: data.PLACA2,
      rucTransp: data.RUC_TRANSP,
      modelo: data.MODELO,
      tipoInspeccion,
      dobleRevision:
        tipoInspeccion === "I" &&
        Number(data.COD_MOD_UND) === COD_UND_CONTENEDOR,
      ingresoParcial,
      codInspIngreso: ingresoParcial ? data.COD_INPS_ING : undefined,
    };
  };
}
