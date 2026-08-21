import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, Pressable, TextInput, View } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"; // --- correcion guardado inspeccion
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

import { palette } from "@/constants/Colors";
import { cx, elevation } from "@/constants/Theme";
import { CameraIcon, CloseIcon, TrashIcon } from "@/constants/Icons";
import {
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { ConfirmDialog } from "@/presentation/utils";

interface Props {
  pregunta: PreguntaInspeccion;
  control: Control<FormularioInspeccion>;
  errors: FieldErrors<FormularioInspeccion>;
  index: number;
}

const CustomField = ({ pregunta, control, index, errors }: Props) => {
  /* EN CASO SEA BOTON BOOLEAN */
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // CONTROL DE MONTAJE SEGURO EN LA PDA
  const [mountCamera, setMountCamera] = useState(false);

  // SOLUCIÓN PANTALLA NEGRA: Fuerza la recreación del hilo nativo del lente
  const [cameraKey, setCameraKey] = useState(0);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  function obtenerExtension(filename: string | null | undefined): string {
    if (!filename) return "";
    const partes = filename.split(".");
    if (partes.length === 1) return "";
    return partes.pop() || "";
  }

  const takePhoto = async (
    onChange: (
      value: { uri: string; mimeType?: string; extension?: string } | null,
    ) => void,
  ) => {
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

      // Incrementamos la Key para resetear de raíz el estado del hardware de video
      setCameraKey((prev) => prev + 1);

      // abrir modal contenedor
      setCameraVisible(true);
    } catch (error) {
      console.log(error);
      alert("No se pudo abrir la cámara.");
    } finally {
      setTakingPhoto(false);
    }
  };

  const capturePhoto = async (
    onChange: (
      value: { uri: string; mimeType?: string; extension?: string } | null,
    ) => void,
  ) => {
    try {
      if (!cameraRef.current || !cameraReady) return;

      // 1. Captura rápida de la foto en bruto
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });

      if (!result?.uri) throw new Error("Sin imagen capturada");

      // 2. Optimización Nativa

      const contexto = ImageManipulator.manipulate(result.uri);
      contexto.resize({ width: 1024 });

      const renderizada = await contexto.renderAsync();
      const optimizada = await renderizada.saveAsync({
        compress: 0.5,
        format: SaveFormat.JPEG,
        base64: true,
      });

      if (!optimizada.base64) throw new Error("No se pudo optimizar la imagen");

      onChange({
        uri: `data:image/jpeg;base64,${optimizada.base64}`,
        mimeType: "image/jpeg",
        extension: "jpg",
      });

      closeCamera();
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
    }
  };

  const closeCamera = () => {
    setCameraReady(false);
    setMountCamera(false); // Desmontamos inmediatamente para forzar la liberación del lente
    setTimeout(() => {
      setCameraVisible(false);
    }, 100);
  };

  const deleteImage = (onChange: (value: null) => void) => {
    ConfirmDialog(
      "Eliminar imagen",
      "¿Estás seguro de que quieres eliminar la imagen?",
      () => {
        onChange(null);
      },
    );
  };

  const esInspeccion = pregunta.categoriaPregunta === "I";
  const conError = Boolean(errors.respuestas?.[Number(pregunta.codigo)]);

  const claseFila = cx(
    "mb-3 rounded-2xl border bg-app-surface px-4 py-4",
    conError ? "border-app-danger" : "border-app-border",
    esInspeccion ? "flex-row items-center gap-x-3" : "gap-y-3",
  );

  const claseLabel = esInspeccion
    ? "flex-[3] flex-row items-start gap-x-2"
    : "flex-row items-start gap-x-2";

  const claseInput = cx(
    "rounded-xl border bg-app-surfaceAlt px-4 py-4 text-base font-semibold text-app-textMain",
    conError ? "border-app-danger" : "border-app-border",
    esInspeccion ? "flex-[2]" : "",
  );

  const MarcaObligatorio = pregunta.obligatorio ? (
    <View className="mt-1 h-2 w-2 rounded-full bg-app-danger" />
  ) : null;

  const PreguntaTitulo = (
    <ThemedText
      className={cx("text-app-textMain", esInspeccion ? "flex-1" : "")}
      type="form-text"
    >
      {pregunta.descripcion}
    </ThemedText>
  );

  const Etiqueta = (
    <View className={claseLabel}>
      {PreguntaTitulo}
      {MarcaObligatorio}
    </View>
  );

  useEffect(() => {
    return () => {
      setCameraReady(false);
      setMountCamera(false);
      setCameraVisible(false);
    };
  }, []);

  switch (pregunta.tipoCampo) {
    case "V":
      return (
        <View className={claseFila}>
          {Etiqueta}

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
            defaultValue={pregunta.codigo}
            render={({ field: { value } }) => (
              <TextInput className={"hidden"} value={value} />
            )}
          />

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
            rules={{
              required: pregunta.obligatorio,
            }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                className={claseInput}
                placeholder="Escriba aqui"
                placeholderTextColor={palette.textMuted}
                value={typeof value === "string" ? value.toString() : ""}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      );

    case "C":
      return (
        <View className={claseFila}>
          {Etiqueta}

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
            defaultValue={pregunta.codigo}
            render={({ field: { value } }) => (
              <TextInput className={"hidden"} value={value} />
            )}
          />

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
            defaultValue={false}
            render={({ field: { value, onChange } }) => (
              <Pressable
                onPress={() => onChange(!value)}
                className={cx(
                  "flex-row items-center justify-center gap-x-2 rounded-xl border px-4 py-3 active:opacity-70",
                  value
                    ? "border-app-success bg-app-successSoft"
                    : "border-app-border bg-app-surfaceAlt",
                  esInspeccion ? "flex-[2]" : "self-start",
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

    case "B":
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
              }, 350);
            }}
            onRequestClose={closeCamera}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
              }}
            >
              {mountCamera ? (
                <CameraView
                  key={cameraKey}
                  ref={cameraRef}
                  style={{
                    flex: 1,
                  }}
                  facing="back"
                  autofocus="on"
                  animateShutter
                  ratio="4:3"
                  onCameraReady={() => {
                    setCameraReady(true);
                  }}
                />
              ) : (
                <View style={{ flex: 1, backgroundColor: "black" }} />
              )}

              <View
                style={{
                  position: "absolute",
                  top: 28,
                  alignSelf: "center",
                  maxWidth: "85%",
                  backgroundColor: "rgba(0,0,0,0.55)",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                }}
              >
                <ThemedText
                  type="caption"
                  className="text-center uppercase text-white"
                  numberOfLines={2}
                >
                  {pregunta.descripcion}
                </ThemedText>
              </View>

              {/* BOTONES */}
              <View
                style={{
                  position: "absolute",
                  bottom: 40,
                  width: "100%",
                  flexDirection: "row-reverse",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {/* CERRAR */}
                <Pressable
                  onPress={closeCamera}
                  style={{
                    backgroundColor: palette.danger,
                    padding: 18,
                    borderRadius: 100,
                  }}
                >
                  <CloseIcon size={26} color={palette.onPrimary} />
                </Pressable>

                {/* TOMAR FOTO */}
                <Controller
                  control={control}
                  name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
                  render={({ field: { onChange } }) => (
                    <Pressable
                      disabled={!cameraReady}
                      onPress={() => capturePhoto(onChange)}
                      style={{
                        backgroundColor: "white",
                        width: 80,
                        height: 80,
                        borderRadius: 100,
                        borderWidth: 5,
                        borderColor: "rgba(255,255,255,0.45)",
                        opacity: cameraReady ? 1 : 0.5,
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </Modal>

          <View className={claseFila}>
            {Etiqueta}

            <Controller
              control={control}
              name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
              defaultValue={pregunta.codigo}
              render={({ field: { value } }) => (
                <TextInput className={"hidden"} value={value} />
              )}
            />

            <Controller
              control={control}
              name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
              rules={{
                required: pregunta.obligatorio,
              }}
              render={({ field: { value, onChange } }) =>
                value &&
                typeof value === "object" &&
                "mimeType" in value &&
                value.mimeType?.includes("image") ? (
                  <Pressable
                    onPress={() => deleteImage(onChange)}
                    className={cx(
                      "relative overflow-hidden rounded-xl border border-app-border active:opacity-70",
                      esInspeccion ? "flex-[2]" : "self-start",
                    )}
                  >
                    <Image
                      source={{ uri: value.uri }}
                      style={{ width: "100%", height: 130, minWidth: 160 }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        backgroundColor: palette.danger,
                        borderRadius: 999,
                        padding: 7,
                      }}
                    >
                      <TrashIcon size={18} color={palette.onPrimary} />
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => takePhoto(onChange)}
                    style={elevation(1)}
                    className={cx(
                      "flex-row items-center justify-center gap-x-2 rounded-xl bg-app-primary px-4 py-4 active:opacity-75",
                      esInspeccion ? "flex-[2]" : "self-start",
                    )}
                  >
                    <CameraIcon size={24} color={palette.onPrimary} />
                    <ThemedText
                      type="semi-bold"
                      className="uppercase text-white"
                    >
                      Tomar foto
                    </ThemedText>
                  </Pressable>
                )
              }
            />
          </View>
        </View>
      );

    case "N":
      return (
        <View className={claseFila}>
          {Etiqueta}

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
            defaultValue={pregunta.codigo}
            render={({ field: { value } }) => (
              <TextInput className={"hidden"} value={value} />
            )}
          />

          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
            rules={{ required: pregunta.obligatorio }}
            render={({ field: { value, onChange } }) => (
              <TextInput
                className={claseInput}
                inputMode="decimal"
                placeholder="0"
                placeholderTextColor={palette.textMuted}
                value={
                  value !== null && value !== undefined ? value.toString() : ""
                }
                onChangeText={(text) => {
                  onChange(text);
                }}
              />
            )}
          />
        </View>
      );
    default:
      return null;
  }
};

export default CustomField;
