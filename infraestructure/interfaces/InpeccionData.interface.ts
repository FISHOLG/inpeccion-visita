export interface DataInspeccionResponse {
  COD_INSPEC: string;
  DESCRIPCION: string;
  TIPO_CAMPO: string;
  FLAG_INSP_UNID: string;
  FLAG_TIPO_INSP: string;
}

export interface InspeccionResponse {
  data: DataInspeccionResponse[];
}
