import {
  ArrowLeftBoldIcon,
  ArrowRightBoldIcon,
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
import ThemedText from "@/presentation/shared/ThemedText";
import ThemedView from "@/presentation/shared/ThemedView";
import { ConfirmDialog } from "@/presentation/utils";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Toast } from "toastify-react-native";

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
    const camposPaso1 = preguntasU.map(
      (p) => `respuestas.${Number(p.codigo)}.respuesta`,
    ) as FieldPath<FormularioInspeccion>[];

    const valid = await trigger(camposPaso1);
    if (!valid) {
      Toast.warn("complete los campos obligatorios");
      return;
    }

    setStepPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setStepPage((prev) => prev - 1);
  };

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
        Toast.error("Error Desconocido");
        return;
      }

      Toast.success("Registro Exitoso");
      setIsSaving(false);
      router.replace("/");
    } catch (error) {
      console.log("Error al guardar inspeccion:", error);
      Toast.error("Error al guardar inspeccion");
      setIsSaving(false);
    }
  };

  const enviarFormulario = async (data: FormularioInspeccion) => {
    const camposPaso2 = preguntasI.map(
      (p) => `respuestas.${Number(p.codigo)}.respuesta`,
    ) as FieldPath<FormularioInspeccion>[];

    const valid = await trigger(camposPaso2);
    if (!valid) {
      Toast.warn("complete los campos obligatorios");
      return;
    }

    const respuestas = data.respuestas;

    const nuevasRespuestas: DetalleInspeccion[] = respuestas.reduce<
      DetalleInspeccion[]
    >((acc, item) => {
      if (item !== undefined) {
        acc.push({ ...item, codUnd: tipoUnd });
      }
      return acc;
    }, []);

    //console.log(nuevasRespuestas);

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

  /*useEffect(() => {
    console.log(errors);
  }, [errors]);*/

  /*useEffect(() => {
        console.log('exito')
        Toast.success(' Exitoso');
    }, []);*/

  if (ListPreguntas.isLoading)
    return (
      <View className="justify-center items-center flex-1">
        <ActivityIndicator color="gray" size={40} />
      </View>
    );

  return (
    <>
      {stepPage === 1 ? (
        <ThemedView safeb>
          <ThemedText
            type={"h3"}
            className={
              "uppercase bg-light-navbar dark:bg-dark-navbar p-2 font-bold"
            }
          >
            Datos de la Unidad
          </ThemedText>
          <FlatList
            data={preguntasU}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item, index }) => (
              <CustomField
                pregunta={item}
                control={control}
                index={index}
                errors={errors}
              />
            )}
          />
        </ThemedView>
      ) : (
        stepPage === 2 && (
          <ThemedView safeb>
            <View className={"flex-row"}>
              <ThemedText
                className={
                  "flex-[4] uppercase bg-light-navbar dark:bg-dark-navbar p-2 font-bold"
                }
                type={"h3"}
              >
                Datos de Inspeccion
              </ThemedText>
            </View>
            <FlatList
              data={preguntasI}
              keyExtractor={(item) => item.codigo}
              renderItem={({ item, index }) => (
                <CustomField
                  pregunta={item}
                  control={control}
                  index={index}
                  errors={errors}
                />
              )}
            />
          </ThemedView>
        )
      )}

      <View className={"flex-row pt-5"}>
        {stepPage > 1 && (
          <Pressable
            onPress={prevPage}
            className={
              "flex-1 justify-center items-center bg-light-danger dark:bg-dark-danger py-3 active:opacity-80"
            }
          >
            <ArrowLeftBoldIcon size={30} />
          </Pressable>
        )}

        {stepPage < maxPage && (
          <Pressable
            onPress={nextPage}
            className={
              "flex-1 justify-center items-center bg-light-success dark:bg-dark-success py-3 active:opacity-80"
            }
          >
            <ArrowRightBoldIcon size={30} />
          </Pressable>
        )}

        {stepPage === maxPage && (
          <Pressable
            onPress={handleSubmit(enviarFormulario)}
            className={
              "flex-1 justify-center items-center bg-light-success dark:bg-dark-success py-3 active:opacity-80" +
              "disabled:bg-gray-300"
            }
            disabled={isSaving}
          >
            {!isSaving ? <SaveIcon size={30} /> : <SpinnerIcon size={30} />}
          </Pressable>
        )}
      </View>
    </>
  );
};

export default FormInspeccion;
