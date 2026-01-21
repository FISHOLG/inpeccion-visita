export type TipoCampoType = "B" | "C" | "V" | "N";
export type CategPreguntaType = "I" | "U";
export type TipoPreguntaType = "I" | "S" | "A";

export type RespuestaImagen = {
    uri: string;
    mimeType?: string;
    extension?: string;
};

export type RespInspeccionType = string | boolean | RespuestaImagen;