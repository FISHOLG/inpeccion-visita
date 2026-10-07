import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { Toast } from "toastify-react-native";

import { palette } from "@/constants/Colors";
import {
  ArrowLeftBoldIcon,
  ArrowRightBoldIcon,
  ClipboardCheckIcon,
  GaugeIcon,
  SaveIcon,
  SpinnerIcon,
} from "@/constants/Icons";
import {
  guardarInspeccion,
  obtenerRespuestasParciales,
} from "@/core/services/Inspeccion.service";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import {
  DetalleInspeccion,
  FormInspecc,
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import { RespInspeccionType } from "@/infraestructure/types/main.type";
import CustomField from "@/presentation/components/inspeccion/CustomField";
import { useDataInspeccion } from "@/presentation/hooks/useDataInspeccion";
import { CLAVE_VEHICULOS_VISITA } from "@/presentation/hooks/useVehiculosVisita";
import EmptyState from "@/presentation/shared/EmptyState";
import ErrorValid from "@/presentation/shared/ErrorValid";
import Loader from "@/presentation/shared/Loader";
import ThemedText from "@/presentation/shared/ThemedText";
import ThemedView from "@/presentation/shared/ThemedView";
import { ConfirmDialog } from "@/presentation/utils";

interface Props {
  tipoIns: string;
  tipoUnd: string;
  placa?: string;
  codInsp?: string;
  itemInsp?: string;
  dobleRevision?: boolean;
  codInspReabrir?: string;
}

const CONTENIDO_LISTA = { padding: 14, paddingBottom: 20 };
const SIN_PREGUNTAS: PreguntaInspeccion[] = [];
const tieneRespuesta = (respuesta: unknown) => {
  if (typeof respuesta === "string") return respuesta.trim() !== "";
  if (typeof respuesta === "boolean") return respuesta;
  return respuesta !== null && respuesta !== undefined;
};

const mismaRespuesta = (a: unknown, b: unknown) => {
  if (a && b && typeof a === "object" && typeof b === "object")
    return (a as { uri?: string }).uri === (b as { uri?: string }).uri;
  return a === b;
};

const FormInspeccion = ({
  tipoIns,
  tipoUnd,
  placa,
  codInsp,
  itemInsp,
  dobleRevision = false,
  codInspReabrir,
}: Props) => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();
  const esReapertura = !!codInspReabrir;
  const esRevisionExterior = dobleRevision && !esReapertura;
  const RespuestasGuardadas = useQuery({
    queryKey: ["inspeccion", "respuestas", codInspReabrir],
    queryFn: () => obtenerRespuestasParciales(codInspReabrir ?? ""),
    enabled: esReapertura,
    staleTime: 0,
    gcTime: 0,
  });

  const { valoresGuardados, guardadas } = useMemo(() => {
    const mapa = new Map<number, RespInspeccionType>();
    const respuestas: FormularioInspeccion["respuestas"] = [];

    (RespuestasGuardadas.data ?? []).forEach((item) => {
      const codigo = Number(item.codPregunta);
      mapa.set(codigo, item.respuesta);
      respuestas[codigo] = item;
    });

    return {
      guardadas: mapa,
      valoresGuardados: mapa.size > 0 ? { respuestas } : undefined,
    };
  }, [RespuestasGuardadas.data]);

  const { ListPreguntas } = useDataInspeccion(tipoUnd);

  const [stepPage, setStepPage] = useState(1);
  const maxPage = 2;

  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormularioInspeccion>({ values: valoresGuardados });

  const { preguntasI, preguntasU } = useMemo(() => {
    const data = ListPreguntas.data;
    if (!data) return { preguntasI: SIN_PREGUNTAS, preguntasU: SIN_PREGUNTAS };

    const { I, U } = data.reduce(
      (
        acc: { I: PreguntaInspeccion[]; U: PreguntaInspeccion[] },
        p: PreguntaInspeccion,
      ) => {
        if (
          p.categoriaPregunta === "I" &&
          (p.tipoPregunta === tipoIns || p.tipoPregunta === "A")
        )
          acc.I.push(p);
        else if (
          p.categoriaPregunta === "U" &&
          (p.tipoPregunta === tipoIns || p.tipoPregunta === "A")
        )
          acc.U.push(p);

        return acc;
      },
      { I: [], U: [] },
    );

    return { preguntasI: I, preguntasU: U };
  }, [ListPreguntas.data, tipoIns]);

  useEffect(() => {
    if (ListPreguntas.data && preguntasU.length === 0) setStepPage(2);
  }, [ListPreguntas.data, preguntasU.length]);

  const nextPage = useCallback(async () => {
    const camposPaso1 = preguntasU.map((p) => {
      if (p.obligatorio) return `respuestas.${Number(p.codigo)}.respuesta`;
    }) as FieldPath<FormularioInspeccion>[];

    const valid = await trigger(camposPaso1);
    if (!valid) {
      Toast.warn("COMPLETE LOS CAMPOS OBLIGATORIOS");
      return;
    }

    setStepPage((prev) => prev + 1);
  }, [preguntasU, trigger]);

  const prevPage = useCallback(() => {
    setStepPage((prev) => prev - 1);
  }, []);

  const saveInspeccion = async (datosSave: FormInspecc) => {
    setIsSaving(true);

    try {
      const peticion = await guardarInspeccion(datosSave);

      if (peticion.error) {
        setIsSaving(false);
        Toast.error(peticion.error);
        return;
      }

      if (!peticion.success) {
        setIsSaving(false);
        Toast.error("ERROR DESCONOCIDO");
        return;
      }

      queryClient.invalidateQueries({ queryKey: CLAVE_VEHICULOS_VISITA });
      Toast.success("Registro Exitoso");
      setIsSaving(false);
      router.replace("/");
    } catch (error) {
      console.log("ERROR AL GUARDAR INSPECCION:", error);
      Toast.error("ERROR AL GUARDAR INSPECCION");
      setIsSaving(false);
    }
  };

  const armarDatos = (
    data: FormularioInspeccion,
    parcial: boolean,
  ): FormInspecc => {
    const respuestas = data.respuestas ?? [];

    const nuevasRespuestas: DetalleInspeccion[] = respuestas.reduce<
      DetalleInspeccion[]
    >((acc, item, codigo) => {
      if (item === undefined) return acc;

      // Lo registrado afuera solo se reenvia si el inspector lo corrigio
      if (guardadas.has(codigo)) {
        if (mismaRespuesta(guardadas.get(codigo), item.respuesta)) return acc;
      } else if (parcial && !tieneRespuesta(item.respuesta)) return acc;

      acc.push({ ...item, codUnd: tipoUnd });
      return acc;
    }, []);

    return {
      usuario: auth?.codUsr ?? "",
      respuestas: nuevasRespuestas,
      tipoInspeccion: tipoIns,
      numPlaca: placa,
      itemIngreso: itemInsp,
      codIngreso: codInsp,
      parcial: parcial || undefined,
    };
  };

  const enviarFormulario = async (data: FormularioInspeccion) => {
    // La revision exterior deja el ingreso abierto para la revision interior
    const datosSave = armarDatos(data, esRevisionExterior);

    ConfirmDialog(
      "¿GUARDAR INSPECCION?",
      "Revise los datos antes de confirmar",
      async () => saveInspeccion(datosSave),
      () => console.log("CANCELADO"),
    );
  };

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PreguntaInspeccion>) => (
      <CustomField pregunta={item} control={control} index={index} />
    ),
    [control],
  );

  const keyExtractor = useCallback(
    (item: PreguntaInspeccion) => item.codigo,
    [],
  );

  if (ListPreguntas.isLoading) return <Loader message="Cargando formulario" />;

  if (esReapertura && RespuestasGuardadas.isFetching)
    return <Loader message="Cargando lo registrado" />;

  if (esReapertura && RespuestasGuardadas.isError)
    return (
      <ThemedView safeb>
        <EmptyState
          title="No se pudo cargar lo registrado"
          description="Revise la conexion e intente de nuevo"
        />
        <View className="px-4">
          <Pressable
            onPress={() => RespuestasGuardadas.refetch()}
            className="items-center justify-center rounded-xl bg-app-primary py-4 active:opacity-70"
          >
            <ThemedText type="semi-bold" className="uppercase text-white">
              Reintentar
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );

  const esPasoUnidad = stepPage === 1;

  return (
    <ThemedView safeb>
      <View className="border-b border-app-border bg-app-surface">
        <View className="flex-row items-center gap-x-3 px-4 pb-3 pt-4">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-app-primarySoft">
            {esPasoUnidad ? (
              <GaugeIcon size={24} color={palette.primary} />
            ) : (
              <ClipboardCheckIcon size={24} color={palette.primary} />
            )}
          </View>

          <View className="flex-1">
            <ThemedText type="label" className="text-app-textMuted">
              Paso {stepPage} de {maxPage}
              {placa ? ` · ${placa}` : ""}
              {dobleRevision
                ? esReapertura
                  ? " · Revision interior"
                  : " · Revision exterior"
                : ""}
            </ThemedText>
            <ThemedText type="h4" className="uppercase text-app-textMain">
              {esPasoUnidad ? "Datos de la unidad" : "Datos de inspeccion"}
            </ThemedText>
          </View>
        </View>

        <View className="h-1.5 w-full flex-row bg-app-surfaceSunken">
          <View
            className="h-full bg-app-primary"
            style={{ width: `${(stepPage / maxPage) * 100}%` }}
          />
        </View>
      </View>

      <View className="flex-1">
        <FlatList
          data={esPasoUnidad ? preguntasU : preguntasI}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={CONTENIDO_LISTA}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {(errors.respuestas?.length ?? 0) > 0 && (
        <View className="px-4 pb-2">
          <ErrorValid message="Complete los campos obligatorios" />
        </View>
      )}

      <View className="flex-row gap-x-3 border-t border-app-border bg-app-surface px-4 py-3">
        {stepPage > 1 && (
          <Pressable
            onPress={prevPage}
            className="flex-1 flex-row items-center justify-center gap-x-2 rounded-xl border border-app-borderStrong bg-app-surfaceAlt py-4 active:opacity-70"
          >
            <ArrowLeftBoldIcon size={22} color={palette.textMain} />
            <ThemedText
              type="semi-bold"
              className="uppercase text-app-textMain"
            >
              Atras
            </ThemedText>
          </Pressable>
        )}

        {stepPage < maxPage && (
          <Pressable
            onPress={nextPage}
            className="flex-1 flex-row items-center justify-center gap-x-2 rounded-xl bg-app-primary py-4 active:opacity-70"
          >
            <ThemedText type="semi-bold" className="uppercase text-white">
              Siguiente
            </ThemedText>
            <ArrowRightBoldIcon size={22} color={palette.onPrimary} />
          </Pressable>
        )}

        {stepPage === maxPage && (
          <Pressable
            onPress={handleSubmit(enviarFormulario)}
            disabled={isSaving}
            className={`flex-1 flex-row items-center justify-center gap-x-2 rounded-xl bg-app-success py-4 active:opacity-70 ${isSaving ? "opacity-60" : ""}`}
          >
            {!isSaving ? (
              <SaveIcon size={22} color={palette.onPrimary} />
            ) : (
              <SpinnerIcon size={22} />
            )}
            <ThemedText type="semi-bold" className="uppercase text-white">
              {isSaving ? "Guardando..." : "Guardar"}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
};

export default FormInspeccion;
