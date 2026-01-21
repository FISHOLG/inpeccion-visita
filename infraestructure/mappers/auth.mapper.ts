import { AuthenticateResponse } from "@/infraestructure/interfaces/auth.interface";
import { Auth } from "@/infraestructure/interfaces/main.interface";

export class AuthMapper {
  static fromAuthenticatetoAuth = (datos: AuthenticateResponse): Auth => {
    return {
      codUsr: datos.data.COD_USR,
      nombrUsr: datos.data.NOMBRE,
      perfil: datos.data.PERFIL,
    };
  };
}
