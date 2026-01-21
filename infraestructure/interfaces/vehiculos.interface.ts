export interface VehiculoResponse {
  NUM_PLACA: string;
  PROPIETARIO: string;
  TIPO_ULT_INSP:string
}

export interface DataVehiculoResponse {
  COD_UND: string;
  TIPO_UNIDAD: string;
  VEHICULOS: VehiculoResponse[];
}

export interface VehiculosResponse {
  data: DataVehiculoResponse[];
}