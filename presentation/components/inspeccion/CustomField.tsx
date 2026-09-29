import { Checkbox } from "@futurejj/react-native-checkbox";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"; // --- correcion guardado inspeccion
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Control, Controller, FieldPath, useFormState } from "react-hook-form";
import {
  Alert,
  Image,
  ImageStyle,
  Modal,
  Pressable,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

import { palette } from "@/constants/Colors";
import {
  CameraIcon,
  CloseIcon,
  SpinnerIcon,
  TrashIcon,
} from "@/constants/Icons";
import { cx, elevation } from "@/constants/Theme";
import {
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { ConfirmDialog } from "@/presentation/utils";

// AJUSTES DE LA FOTO FINAL
const ANCHO_FOTO = 1024;
const COMPRESION_FOTO = 0.5;
const RETARDO_MONTAJE_MS = 150;

// El tamano de captura se consulta una sola vez y se reutiliza en todos los campos
let tamanoFotoCache: string | null = null;
let tamanoFotoConsultado = false;

const elegirTamanoFoto = (tamanos: string[]): string | null => {
  const opciones = tamanos
    .map((tam) => {
      const [ancho, alto] = tam.split("x").map(Number);
      return { tam, ancho, alto };
    })
    .filter((o) => Number.isFinite(o.ancho) && Number.isFinite(o.alto))
    .sort((a, b) => a.ancho * a.alto - b.ancho * b.alto);

  if (opciones.length === 0) return null;

  const cuatroTercios = opciones.filter(
    (o) => Math.abs(o.ancho / o.alto - 4 / 3) < 0.05,
  );
  const candidatas = cuatroTercios.length > 0 ? cuatroTercios : opciones;

  return (
    candidatas.find((o) => Math.max(o.ancho, o.alto) >= ANCHO_FOTO)?.tam ??
    candidatas[candidatas.length - 1].tam
  );
};

type FuenteImagen = Parameters<typeof ImageManipulator.manipulate>[0];

type CambioRespuesta = (
  value: { uri: string; mimeType?: string; extension?: string } | null,
) => void;

interface Props {
  pregunta: PreguntaInspeccion;
  control: Control<FormularioInspeccion>;
  index?: number;
}

const nombreRespuesta = (pregunta: PreguntaInspeccion) =>
  `respuestas.${Number(
    pregunta.codigo,
  )}.respuesta` as FieldPath<FormularioInspeccion>;

const nombreCodigo = (pregunta: PreguntaInspeccion) =>
  `respuestas.${Number(
    pregunta.codigo,
  )}.codPregunta` as FieldPath<FormularioInspeccion>;

const useErrorCampo = (
  control: Control<FormularioInspeccion>,
  pregunta: PreguntaInspeccion,
) => {
  const { errors } = useFormState({
    control,
    name: nombreRespuesta(pregunta),
  });
  return Boolean(errors.respuestas?.[Number(pregunta.codigo)]);
};

const useClasesCampo = (pregunta: PreguntaInspeccion, conError: boolean) => {
  const esInspeccion = pregunta.categoriaPregunta === "I";

  return useMemo(
    () => ({
      esInspeccion,
      claseFila: cx(
        "mb-3 rounded-2xl border bg-app-surface px-4 py-4",
        conError ? "border-app-danger" : "border-app-border",
        esInspeccion ? "flex-row items-center gap-x-3" : "gap-y-3",
      ),
      claseLabel: esInspeccion
        ? "flex-[3] flex-row items-start gap-x-2"
        : "flex-row items-start gap-x-2",
      claseInput: cx(
        "rounded-xl border bg-app-surfaceAlt px-4 py-4 text-base font-semibold text-app-textMain",
        conError ? "border-app-danger" : "border-app-border",
        esInspeccion ? "flex-[2]" : "",
      ),
      claseAccion: esInspeccion ? "flex-[2]" : "self-start",
      claseTitulo: cx("text-app-textMain", esInspeccion ? "flex-1" : ""),
    }),
    [esInspeccion, conError],
  );
};

const Etiqueta = React.memo(
  ({
    pregunta,
    claseLabel,
    claseTitulo,
  }: {
    pregunta: PreguntaInspeccion;
    claseLabel: string;
    claseTitulo: string;
  }) => (
    <View className={claseLabel}>
      <ThemedText className={claseTitulo} type="form-text">
        {pregunta.descripcion}
      </ThemedText>
      {pregunta.obligatorio ? (
        <View className="mt-1 h-2 w-2 rounded-full bg-app-danger" />
      ) : null}
    </View>
  ),
);
Etiqueta.displayName = "Etiqueta";

const CampoCodigo = React.memo(
  ({
    pregunta,
    control,
  }: {
    pregunta: PreguntaInspeccion;
    control: Control<FormularioInspeccion>;
  }) => (
    <Controller
      control={control}
      name={nombreCodigo(pregunta)}
      defaultValue={pregunta.codigo}
      render={() => <></>}
    />
  ),
);
CampoCodigo.displayName = "CampoCodigo";

const CampoTexto = ({
  pregunta,
  control,
  numerico,
}: Props & { numerico: boolean }) => {
  const conError = useErrorCampo(control, pregunta);
  const clases = useClasesCampo(pregunta, conError);

  return (
    <View className={clases.claseFila}>
      <Etiqueta
        pregunta={pregunta}
        claseLabel={clases.claseLabel}
        claseTitulo={clases.claseTitulo}
      />

      <CampoCodigo pregunta={pregunta} control={control} />

      <Controller
        control={control}
        name={nombreRespuesta(pregunta)}
        rules={{ required: pregunta.obligatorio }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={clases.claseInput}
            inputMode={numerico ? "decimal" : undefined}
            placeholder={numerico ? "0" : "Escriba aqui"}
            placeholderTextColor={palette.textMuted}
            value={value !== null && value !== undefined ? String(value) : ""}
            onChangeText={onChange}
          />
        )}
      />
    </View>
  );
};

const CampoCheck = ({ pregunta, control }: Props) => {
  const conError = useErrorCampo(control, pregunta);
  const clases = useClasesCampo(pregunta, conError);

  return (
    <View className={clases.claseFila}>
      <Etiqueta
        pregunta={pregunta}
        claseLabel={clases.claseLabel}
        claseTitulo={clases.claseTitulo}
      />

      <CampoCodigo pregunta={pregunta} control={control} />

      <Controller
        control={control}
        name={nombreRespuesta(pregunta)}
        defaultValue={false}
        render={({ field: { value, onChange } }) => (
          <Pressable
            onPress={() => onChange(!value)}
            className={cx(
              "flex-row items-center justify-center gap-x-2 rounded-xl border px-4 py-3 active:opacity-70",
              value
                ? "border-app-success bg-app-successSoft"
                : "border-app-border bg-app-surfaceAlt",
              clases.claseAccion,
            )}
          >
            <View pointerEvents="none">
              <Checkbox
                status={value ? "checked" : "unchecked"}
                size={28}
                color={palette.success}
                uncheckedColor={palette.textMuted}
              />
            </View>
            <ThemedText
              type="semi-bold"
              className={cx(
                "uppercase",
                value ? "text-app-success" : "text-app-textSecond",
              )}
            >
              {value ? "Conforme" : "Marcar"}
            </ThemedText>
          </Pressable>
        )}
      />
    </View>
  );
};

const CampoFoto = ({ pregunta, control }: Props) => {
  const conError = useErrorCampo(control, pregunta);
  const clases = useClasesCampo(pregunta, conError);

  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // La optimizacion corre con la camara ya cerrada
  const [procesando, setProcesando] = useState(false);
  const [tamanoFoto, setTamanoFoto] = useState<string | null>(null);
  const [mountCamera, setMountCamera] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  const cachearTamanoFoto = useCallback(async () => {
    if (tamanoFotoConsultado || !cameraRef.current) return;
    tamanoFotoConsultado = true;
    try {
      const tamanos = await cameraRef.current.getAvailablePictureSizesAsync();
      tamanoFotoCache = elegirTamanoFoto(tamanos ?? []);
    } catch (error) {
      console.log("NO SE PUDO LEER LOS TAMANOS DE CAPTURA:", error);
    }
  }, []);

  const closeCamera = useCallback(() => {
    setCameraReady(false);
    setMountCamera(false);
    setTimeout(() => {
      setCameraVisible(false);
    }, 100);
  }, []);

  const takePhoto = useCallback(async () => {
    try {
      if (takingPhoto) return;
      setTakingPhoto(true);

      // permisos
      if (!permission?.granted) {
        const response = await requestPermission();
        if (!response.granted) {
          alert("Se requiere permiso para usar la cámara.");
          return;
        }
      }

      setCameraKey((prev) => prev + 1);
      setTamanoFoto(tamanoFotoCache);
      setCameraVisible(true);
    } catch (error) {
      console.log(error);
      alert("No se pudo abrir la cámara.");
    } finally {
      setTakingPhoto(false);
    }
  }, [permission?.granted, requestPermission, takingPhoto]);

  const capturePhoto = useCallback(
    async (onChange: CambioRespuesta) => {
      const camara = cameraRef.current;
      if (!camara || !cameraReady || procesando) return;

      setProcesando(true);

      try {
        let fuente: FuenteImagen | null = null;

        try {
          fuente = await camara.takePictureAsync({ pictureRef: true });
        } catch (errorRef) {
          console.log("SIN CAPTURA EN MEMORIA, USANDO ARCHIVO:", errorRef);
          const result = await camara.takePictureAsync({
            quality: 0.8,
            base64: false,
            skipProcessing: true,
          });
          fuente = result?.uri ?? null;
        }

        if (!fuente) throw new Error("Sin imagen capturada");

        closeCamera();

        const contexto = ImageManipulator.manipulate(fuente);
        contexto.resize({ width: ANCHO_FOTO });

        const renderizada = await contexto.renderAsync();
        const optimizada = await renderizada.saveAsync({
          compress: COMPRESION_FOTO,
          format: SaveFormat.JPEG,
          base64: true,
        });

        if (!optimizada.base64)
          throw new Error("No se pudo optimizar la imagen");

        onChange({
          uri: `data:image/jpeg;base64,${optimizada.base64}`,
          mimeType: "image/jpeg",
          extension: "jpg",
        });
      } catch (error: any) {
        console.log("ERROR CAMARA:", error);
        closeCamera();

        const message = error?.message?.toLowerCase?.() || "";
        if (
          message.includes("camera") ||
          message.includes("busy") ||
          message.includes("cannot")
        ) {
          Alert.alert(
            "La cámara está siendo usada por otra aplicación o el hardware de la PDA.",
          );
        } else {
          Alert.alert("No se pudo tomar la foto.");
        }
      } finally {
        setProcesando(false);
      }
    },
    [cameraReady, closeCamera, procesando],
  );

  const deleteImage = useCallback((onChange: CambioRespuesta) => {
    ConfirmDialog(
      "Eliminar imagen",
      "¿Estás seguro de que quieres eliminar la imagen?",
      () => {
        onChange(null);
      },
    );
  }, []);

  useEffect(() => {
    return () => {
      setCameraReady(false);
      setMountCamera(false);
      setCameraVisible(false);
    };
  }, []);

  return (
    <View className="relative">
      {/* MODAL CAMARA */}
      <Modal
        visible={cameraVisible}
        transparent={false}
        animationType="none"
        presentationStyle="fullScreen"
        statusBarTranslucent={false}
        hardwareAccelerated
        // Dellay pa que el OS desconecte el servicio
        onShow={() => {
          setTimeout(() => {
            setMountCamera(true);
          }, RETARDO_MONTAJE_MS);
        }}
        onRequestClose={closeCamera}
      >
        <View style={ESTILO_MODAL}>
          {mountCamera ? (
            <CameraView
              key={cameraKey}
              ref={cameraRef}
              style={ESTILO_CAMARA}
              facing="back"
              autofocus="on"
              animateShutter={false}
              ratio="4:3"
              pictureSize={tamanoFoto ?? undefined}
              onCameraReady={() => {
                setCameraReady(true);
                cachearTamanoFoto();
              }}
            />
          ) : (
            <View style={ESTILO_MODAL} />
          )}

          <View style={ESTILO_TITULO_CAMARA}>
            <ThemedText
              type="caption"
              className="text-center uppercase text-white"
              numberOfLines={2}
            >
              {pregunta.descripcion}
            </ThemedText>
          </View>

          {/* BOTONES */}
          <View style={ESTILO_BOTONERA}>
            {/* CERRAR */}
            <Pressable onPress={closeCamera} style={ESTILO_CERRAR}>
              <CloseIcon size={26} color={palette.onPrimary} />
            </Pressable>

            {/* TOMAR FOTO */}
            <Controller
              control={control}
              name={nombreRespuesta(pregunta)}
              render={({ field: { onChange } }) => (
                <Pressable
                  disabled={!cameraReady || procesando}
                  onPress={() => capturePhoto(onChange)}
                  style={[
                    ESTILO_DISPARADOR,
                    { opacity: cameraReady && !procesando ? 1 : 0.5 },
                  ]}
                />
              )}
            />
          </View>
        </View>
      </Modal>

      <View className={clases.claseFila}>
        <Etiqueta
          pregunta={pregunta}
          claseLabel={clases.claseLabel}
          claseTitulo={clases.claseTitulo}
        />

        <CampoCodigo pregunta={pregunta} control={control} />

        <Controller
          control={control}
          name={nombreRespuesta(pregunta)}
          rules={{ required: pregunta.obligatorio }}
          render={({ field: { value, onChange } }) =>
            value &&
            typeof value === "object" &&
            "mimeType" in value &&
            value.mimeType?.includes("image") ? (
              <Pressable
                onPress={() => deleteImage(onChange)}
                className={cx(
                  "relative overflow-hidden rounded-xl border border-app-border active:opacity-70",
                  clases.claseAccion,
                )}
              >
                <Image source={{ uri: value.uri }} style={ESTILO_MINIATURA} />
                <View style={ESTILO_BORRAR}>
                  <TrashIcon size={18} color={palette.onPrimary} />
                </View>
              </Pressable>
            ) : procesando ? (
              <View
                style={elevation(1)}
                className={cx(
                  "flex-row items-center justify-center gap-x-2 rounded-xl bg-app-primary px-4 py-4 opacity-70",
                  clases.claseAccion,
                )}
              >
                <SpinnerIcon size={24} />
                <ThemedText type="semi-bold" className="uppercase text-white">
                  Procesando...
                </ThemedText>
              </View>
            ) : (
              <Pressable
                onPress={takePhoto}
                style={elevation(1)}
                className={cx(
                  "flex-row items-center justify-center gap-x-2 rounded-xl bg-app-primary px-4 py-4 active:opacity-75",
                  clases.claseAccion,
                )}
              >
                <CameraIcon size={24} color={palette.onPrimary} />
                <ThemedText type="semi-bold" className="uppercase text-white">
                  Tomar foto
                </ThemedText>
              </Pressable>
            )
          }
        />
      </View>
    </View>
  );
};

const ESTILO_MODAL: ViewStyle = { flex: 1, backgroundColor: "black" };
const ESTILO_CAMARA: ViewStyle = { flex: 1 };
const ESTILO_TITULO_CAMARA: ViewStyle = {
  position: "absolute",
  top: 28,
  alignSelf: "center",
  maxWidth: "85%",
  backgroundColor: "rgba(0,0,0,0.55)",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 999,
};
const ESTILO_BOTONERA: ViewStyle = {
  position: "absolute",
  bottom: 40,
  width: "100%",
  flexDirection: "row-reverse",
  justifyContent: "space-around",
  alignItems: "center",
};
const ESTILO_CERRAR: ViewStyle = {
  backgroundColor: palette.danger,
  padding: 18,
  borderRadius: 100,
};
const ESTILO_DISPARADOR: ViewStyle = {
  backgroundColor: "white",
  width: 80,
  height: 80,
  borderRadius: 100,
  borderWidth: 5,
  borderColor: "rgba(255,255,255,0.45)",
};
const ESTILO_MINIATURA: ImageStyle = {
  width: "100%",
  height: 130,
  minWidth: 160,
};
const ESTILO_BORRAR: ViewStyle = {
  position: "absolute",
  right: 8,
  top: 8,
  backgroundColor: palette.danger,
  borderRadius: 999,
  padding: 7,
};

const CustomField = ({ pregunta, control, index }: Props) => {
  switch (pregunta.tipoCampo) {
    case "V":
      return (
        <CampoTexto
          pregunta={pregunta}
          control={control}
          index={index}
          numerico={false}
        />
      );
    case "N":
      return (
        <CampoTexto
          pregunta={pregunta}
          control={control}
          index={index}
          numerico
        />
      );
    case "C":
      return <CampoCheck pregunta={pregunta} control={control} index={index} />;
    case "B":
      return <CampoFoto pregunta={pregunta} control={control} index={index} />;
    default:
      return null;
  }
};

export default React.memo(CustomField);
