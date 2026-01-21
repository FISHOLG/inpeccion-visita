import {
  DataVehiculoResponse,

} from "@/infraestructure/interfaces/vehiculos.interface";
import {
  TipoVehiculosPP,
  VehiculosVisita,
} from "@/infraestructure/interfaces/main.interface";
import { DataVehiVisita } from "@/infraestructure/interfaces/vehiculosVistita.interface";

export class VehiculoMapper {
    static FromVehiculoDbToVehiculo = (item: DataVehiculoResponse): TipoVehiculosPP => {
        return {
            tipoTrans: item.COD_UND,
            descTrans: item.TIPO_UNIDAD,
            vehiculos: item.VEHICULOS.map((v) => ({
                numPlaca: v.NUM_PLACA,
                propietario: v.PROPIETARIO,
                tipoTrans: item.COD_UND,
                tipoUltInsp:v.TIPO_ULT_INSP
            })),
        };
    };

  static FromVahiculosViDBtoVahiculosVisita=(data:DataVehiVisita):VehiculosVisita=>
  {
      return {
          codIngreso:data.COD_INGRESO,
          itemIngreso:data.ITEM_ING,
          codUnd:data.COD_MOD_UND,
          fechaIngreso:data.FECHA_INGRESO,
          placa1:data.PLACA1,
          placa2:data.PLACA2,
          rucTransp:data.RUC_TRANSP,
          modelo:data.MODELO,
          tipoInspeccion:!data.COD_INPS_ING?'I':'S'
      }

  }
}
