import { LoginForm } from "@/infraestructure/interfaces/formularios.interface";
import { AuthMapper } from "@/infraestructure/mappers/auth.mapper";
import { inspeccionApi } from "@/core/api/inspeccion-api";

export const IniciarSesion = async (datos: LoginForm) => {
  try {
    const url = `/login`;
    const data = { ...datos };
    const peticion = await inspeccionApi.post(url, data);

    return AuthMapper.fromAuthenticatetoAuth(peticion.data);
  } catch (error: any) {
    let message = "";
    if (error.code && error.code == "ERR_NETWORK") {
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
