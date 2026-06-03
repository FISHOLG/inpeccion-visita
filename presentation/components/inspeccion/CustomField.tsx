import { CameraIcon, CloseIcon, ExclamationIcon } from "@/constants/Icons";
import {
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { ConfirmDialog } from "@/presentation/utils";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
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

  // NUEVO: Estado para controlar el montaje seguro de la cámara en la PDA
  const [mountCamera, setMountCamera] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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
    if (partes.length === 1) return ""; // No tiene extensión
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

      // abrir cámara
      setCameraVisible(true);
    } catch (error) {
      console.log(error);

      alert("No se pudo abrir la cámara.");
    } finally {
      setTakingPhoto(false);
    }
  };

  // const capturePhoto = async (
  //   onChange: (
  //     value: { uri: string; mimeType?: string; extension?: string } | null,
  //   ) => void,
  // ) => {
  //   try {
  //     if (!cameraRef.current) return;

  //     const result = await cameraRef.current.takePictureAsync({
  //       quality: 0.7,
  //       base64: false,
  //       skipProcessing: true,
  //     });

  //     console.log(result);

  //     let uri = result.uri;

  //     // convertir a base64 SOLO si realmente lo necesitas
  //     if (Platform.OS === "android" || Platform.OS === "ios") {
  //       const base64 = await FileSystem.readAsStringAsync(result.uri, {
  //         encoding: "base64",
  //       });

  //       uri = `data:image/jpeg;base64,${base64}`;
  //     }

  //     onChange({
  //       uri,
  //       mimeType: "image/jpeg",
  //       extension: "jpg",
  //     });

  //     // cerrar cámara de forma segura liberando recursos
  //     closeCamera();
  //   } catch (error: any) {
  //     console.log("ERROR CAMARA:", error);

  //     closeCamera();

  //     const message = error?.message?.toLowerCase?.() || "";

  //     if (
  //       message.includes("camera") ||
  //       message.includes("busy") ||
  //       message.includes("cannot")
  //     ) {
  //       Alert.alert(
  //         "La cámara está siendo usada por otra aplicación o el hardware del escáner.",
  //       );
  //     } else {
  //       Alert.alert("No se pudo tomar la foto.");
  //     }
  //   }
  // };

  // NUEVO: Función centralizada para desmontar la cámara ordenadamente
  const capturePhoto = async (
    onChange: (
      value: { uri: string; mimeType?: string; extension?: string } | null,
    ) => void,
  ) => {
    try {
      if (!cameraRef.current) return;

      // 1. Captura rápida de la foto en bruto
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8, // Calidad inicial alta para no perder enfoque
        base64: false, // Falso aquí, lo delegamos al manipulador
        skipProcessing: true, // Evita procesamiento extra del sistema operativo
      });

      console.log("Foto capturada en bruto:", result.uri);

      // 2. Optimización Nativa (Redimensionar + Comprimir + Base64 todo en un paso)
      // Pasamos la imagen por el hilo nativo reduciendo el ancho a 1280px (suficiente para auditorías)
      const manipulated = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 1280 } }], // Mantiene la relación de aspecto automáticamente
        {
          compress: 0.6, // Compresión al 60% (ideal para texto/inspecciones sin pixelear)
          format: ImageManipulator.SaveFormat.JPEG, // ¡Usa siempre JPEG! PNG es extremadamente lento
          base64: true, // El motor nativo genera el Base64 de forma ultra veloz
        },
      );

      // 3. Construimos el URI en Base64 optimizado
      const uri = `data:image/jpeg;base64,${manipulated.base64}`;

      onChange({
        uri,
        mimeType: "image/jpeg",
        extension: "jpg",
      });

      // Cerrar cámara de forma segura liberando recursos
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
    setMountCamera(false); // Desmonta la cámara primero para liberar el hardware
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
            // NUEVO: Espera a que el modal se renderice en la PDA antes de levantar la cámara
            onShow={() => {
              setTimeout(() => {
                setMountCamera(true);
              }, 250); // Delay estratégico para liberar hilos del escáner Chainway
            }}
            onRequestClose={closeCamera}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
              }}
            >
              {/* NUEVO: Montaje condicional y asignación de relación de aspecto 4:3 industrial */}
              {mountCamera ? (
                <CameraView
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
                  flexDirection: "row",
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

          {/* Conservados intactos tus nuevos cambios de maquetación con flex-[4] */}
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
                      style={{ width: 180, height: 120 }}
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
