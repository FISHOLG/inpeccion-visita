import { CameraIcon, CloseIcon, ExclamationIcon } from "@/constants/Icons";
import {
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { ConfirmDialog } from "@/presentation/utils";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"; // --- correcion guardado inspeccion
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Alert, Image, Modal, Pressable, TextInput, View } from "react-native";

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

  const PreguntaTitulo = () => (
    <ThemedText
      className={`${pregunta.categoriaPregunta === "I" && "flex-[4]"}`}
      type="form-text"
    >
      {pregunta.descripcion}
    </ThemedText>
  );

  useEffect(() => {
    return () => {
      setCameraReady(false);
      setMountCamera(false);
      setCameraVisible(false);
    };
  }, []);

  console.log("obligatorio ", pregunta.obligatorio);

  switch (pregunta.tipoCampo) {
    case "V":
      return (
        <View
          className={`${pregunta.categoriaPregunta === "I" && "flex-row items-center border-b border-gray-300"} gap-3  py-4`}
        >
          <View className="flex-[4] flex-row items-center gap-3">
            <PreguntaTitulo />
            {pregunta.obligatorio && (
              <ExclamationIcon className="text-red-500" size={20} />
            )}
          </View>

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
                className={
                  "py-5 bg-white rounded-md px-3 font-semibold text-lg border" +
                  " border-[#D0D0D0] " +
                  `${pregunta.categoriaPregunta === "I" && "flex-1"}`
                }
                value={typeof value === "string" ? value.toString() : ""}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      );
    case "C":
      return (
        <View
          className={`${pregunta.categoriaPregunta === "I" && " flex-row items-center border-b border-gray-300"} gap-3  py-4`}
        >
          <View className="flex-[4] flex-row items-center gap-3">
            <PreguntaTitulo />
            {pregunta.obligatorio && (
              <ExclamationIcon className="text-red-500" size={20} />
            )}
          </View>
          <Controller
            control={control}
            name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
            defaultValue={pregunta.codigo}
            render={({ field: { value } }) => (
              <TextInput className={"hidden"} value={value} />
            )}
          />
          <View
            className={`${pregunta.categoriaPregunta === "I" && "flex-1"} items-center justify-center w-24`}
          >
            <Controller
              control={control}
              name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
              defaultValue={false}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  size={30}
                />
              )}
            />
          </View>
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
                    backgroundColor: "red",
                    padding: 18,
                    borderRadius: 100,
                  }}
                >
                  <CloseIcon />
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
                        opacity: cameraReady ? 1 : 0.5,
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </Modal>

          <View
            className={`${pregunta.categoriaPregunta === "I" && "flex-row items-center border-b border-gray-300"} gap-3 py-4`}
          >
            <View className="flex-[4] flex-row items-center gap-3">
              <PreguntaTitulo />
              {pregunta.obligatorio && (
                <ExclamationIcon className="text-red-500" size={20} />
              )}
            </View>

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
                    className={`${pregunta.categoriaPregunta === "I" && "flex-1"} flex-row items-center gap-x-5`}
                  >
                    <Image
                      source={{ uri: value.uri }}
                      style={{ width: 180, height: 120, borderRadius: 6 }}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => takePhoto(onChange)}
                    className={
                      "bg-light-primary dark:bg-dark-primary p-2 rounded-lg justify-center items-center " +
                      `${pregunta.categoriaPregunta === "I" && "flex-1"}`
                    }
                  >
                    <CameraIcon />
                  </Pressable>
                )
              }
            />
          </View>
        </View>
      );
    case "N":
      return (
        <View
          className={`${pregunta.categoriaPregunta === "I" && "flex-row items-center border-b border-gray-300"} gap-3  py-4`}
        >
          <View className="flex-[4] flex-row items-center gap-3">
            <PreguntaTitulo />
            {pregunta.obligatorio && (
              <ExclamationIcon className="text-red-500" size={20} />
            )}
          </View>
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
                className={
                  "py-5 bg-white rounded-md px-3 font-semibold text-lg border border-[#D0D0D0]" +
                  `${pregunta.categoriaPregunta === "I" && "flex-1"}`
                }
                inputMode="decimal"
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
