export interface Data {
  COD_USR: string;
  NOMBRE: string;
  PERFIL: string;
}

export interface AuthenticateResponse {
  success: boolean;
  data: Data;
}
