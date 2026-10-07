export interface DataVehiVisita {
  COD_INGRESO: string;
  ITEM_ING: string;
  RUC_TRANSP: string;
  PLACA1: string;
  PLACA2: string;
  COD_INPS_ING?: string;
  COD_INPS_SAL?: string;
  COD_MOD_UND: string;
  FECHA_INGRESO: string;
  MODELO: string;
  ESTADO_INSP_ING?: string | null;
}

export interface VehiVisitaResponse {
  data: DataVehiVisita[];
}