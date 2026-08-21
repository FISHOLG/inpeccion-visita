import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { FieldPath, useForm } from "react-hook-form";
import { router } from "expo-router";
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
import { guardarInspeccion } from "@/core/services/Inspeccion.service";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import {
  DetalleInspeccion,
  FormInspecc,
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import CustomField from "@/presentation/components/inspeccion/CustomField";
import { useDataInspeccion } from "@/presentation/hooks/useDataInspeccion";
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
}

const FormInspeccion = ({
  tipoIns,
  tipoUnd,
  placa,
  codInsp,
  itemInsp,
}: Props) => {
  const { auth } = useAuthContext();

  const { ListPreguntas } = useDataInspeccion(tipoUnd);

  const [preguntasI, setPreguntasI] = useState<PreguntaInspeccion[]>([]);
  const [preguntasU, setPreguntasU] = useState<PreguntaInspeccion[]>([]);

  const [stepPage, setStepPage] = useState(1);
  const maxPage = 2;

  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormularioInspeccion>();

  const nextPage = async () => {
    const camposPaso1 = preguntasU.map((p) => {
      if (p.obligatorio) return `respuestas.${Number(p.codigo)}.respuesta`;
    }) as FieldPath<FormularioInspeccion>[];

    const valid = await trigger(camposPaso1);
    if (!valid) {
      Toast.warn("COMPLETE LOS CAMPOS OBLIGATORIOS");
      return;
    }

    setStepPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setStepPage((prev) => prev - 1);
  };

  const saveInspeccion = async (datosSave: FormInspecc) => {
    console.log("click");

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

      Toast.success("Registro Exitoso");
      setIsSaving(false);
      router.replace("/");
    } catch (error) {
      console.log("ERROR AL GUARDAR INSPECCION:", error);
      Toast.error("ERROR AL GUARDAR INSPECCION");
      setIsSaving(false);
    }
  };

  const enviarFormulario = async (data: FormularioInspeccion) => {
    const respuestas = data.respuestas;

    const nuevasRespuestas: DetalleInspeccion[] = respuestas.reduce<
      DetalleInspeccion[]
    >((acc, item) => {
      if (item !== undefined) {
        acc.push({ ...item, codUnd: tipoUnd });
      }
      return acc;
    }, []);

    const datosSave: FormInspecc = {
      usuario: auth?.codUsr ?? "",
      respuestas: nuevasRespuestas,
      tipoInspeccion: tipoIns,
      numPlaca: placa,
      itemIngreso: itemInsp,
      codIngreso: codInsp,
    };

    ConfirmDialog(
      "¿GUARDAR INSPECCION?",
      "Revise los datos antes de confirmar",
      async () => saveInspeccion(datosSave),
      () => console.log("CANCELADO"),
    );
  };

  useEffect(() => {
    if (!ListPreguntas.isLoading && ListPreguntas.data) {
      const { I, U } = ListPreguntas.data.reduce(
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

      setPreguntasI(I);
      setPreguntasU(U);

      if (U.length === 0) setStepPage(2);
    }
  }, [ListPreguntas.isLoading, ListPreguntas.data]);

  if (ListPreguntas.isLoading) return <Loader message="Cargando formulario" />;

  const esPasoUnidad = stepPage === 1;

  const Encabezado = (
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
  );

  return (
    <ThemedView safeb>
      {Encabezado}

      <View className="flex-1">
        <FlatList
          data={esPasoUnidad ? preguntasU : preguntasI}
          keyExtractor={(item) => item.codigo}
          contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CustomField
              pregunta={item}
              control={control}
              index={index}
              errors={errors}
            />
          )}
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
            className="flex-1 flex-row items-center justify-center gap-x-2 rounded-xl bg-app-surfaceAlt border border-app-borderStrong py-4 active:opacity-70"
          >
            <ArrowLeftBoldIcon size={22} color={palette.textMain} />
            <ThemedText type="semi-bold" className="uppercase text-app-textMain">
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
