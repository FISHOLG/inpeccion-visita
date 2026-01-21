import {
  CategPreguntaType,
  RespInspeccionType,
  TipoCampoType,
  TipoPreguntaType,
} from "@/infraestructure/types/main.type";

export interface Auth {
  codUsr: string;
  nombrUsr: string;
  perfil: string;
}

export interface TipoVehiculosPP
{
    tipoTrans: string;
    descTrans:string
    vehiculos:Vehiculo[]
}

export interface Vehiculo {
  numPlaca: string;
  propietario: string;
  tipoTrans: string;
  tipoUltInsp: string;
}



export interface PreguntaInspeccion {
  codigo: string;
  descripcion: string;
  tipoCampo: TipoCampoType;
  categoriaPregunta: CategPreguntaType;
  tipoPregunta: TipoPreguntaType;
}

// Interfaces de React-Hook-Form
export interface FormularioInspeccion {
    respuestas: DetalleFormInspeccion[];
}

export interface DetalleFormInspeccion {

    codPregunta: string;
    respuesta: RespInspeccionType;
    observacion?: string;
}
//////////////////////////////////////////////


// Datos Enviados a base de datos
export interface FormInspecc {
  usuario: string;
  respuestas: DetalleInspeccion[];
  tipoInspeccion: string;
  numPlaca?: string;
  codIngreso?: string;
  itemIngreso?: string;
}

export interface DetalleInspeccion extends DetalleFormInspeccion {
  codUnd: string;
}
//////////////////////////////////////////

export interface VehiculosVisita
{
    codIngreso: string;
    itemIngreso: string;
    rucTransp: string;
    placa1:string;
    placa2: string;
    codUnd:string;
    fechaIngreso:string;
    modelo:string;
    tipoInspeccion:string;
}

