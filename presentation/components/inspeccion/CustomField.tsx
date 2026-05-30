import { CameraIcon, CloseIcon, ExclamationIcon } from "@/constants/Icons";
import {
  FormularioInspeccion,
  PreguntaInspeccion,
} from "@/infraestructure/interfaces/main.interface";
import ThemedText from "@/presentation/shared/ThemedText";
import { ConfirmDialog } from "@/presentation/utils";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

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

  const capturePhoto = async (
    onChange: (
      value: { uri: string; mimeType?: string; extension?: string } | null,
    ) => void,
  ) => {
    try {
      if (!cameraRef.current) return;

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        skipProcessing: true,
      });

      console.log(result);

      let uri = result.uri;

      // convertir a base64 SOLO si realmente lo necesitas
      if (Platform.OS === "android" || Platform.OS === "ios") {
        const base64 = await FileSystem.readAsStringAsync(result.uri, {
          encoding: "base64",
        });

        uri = `data:image/jpeg;base64,${base64}`;
      }

      onChange({
        uri,
        mimeType: "image/jpeg",
        extension: "jpg",
      });

      // cerrar cámara
      setCameraReady(false);

      setTimeout(() => {
        setCameraVisible(false);
      }, 100);
    } catch (error: any) {
      console.log("ERROR CAMARA:", error);

      setCameraReady(false);

      setTimeout(() => {
        setCameraVisible(false);
      }, 100);

      const message = error?.message?.toLowerCase?.() || "";

      if (
        message.includes("camera") ||
        message.includes("busy") ||
        message.includes("cannot")
      ) {
        Alert.alert("La cámara está siendo usada por otra aplicación.");
      } else {
        Alert.alert("No se pudo tomar la foto.");
      }
    }
  };

  // const takePhoto = async (
  //   onChange: (
  //     value: { uri: string; mimeType?: string; extension?: string } | null,
  //   ) => void,
  // ) => {
  //   // pedir permisos de cámara
  //   const permission = await ImagePicker.requestCameraPermissionsAsync();
  //   if (!permission.granted) {
  //     alert("Se requiere permiso para usar la cámara.");
  //     return;
  //   }

  //   // abrir cámara
  //   const result = await ImagePicker.launchCameraAsync({
  //     mediaTypes: ["images", "videos"],
  //     quality: 0.7,
  //     // quality: 1,
  //     allowsEditing: false,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     let uri = result.assets[0].uri;

  //     /*const manipulated = await ImageManipulator.manipulateAsync(
  //             result.assets[0].uri,
  //             [{ resize: { width: 1280 } }],
  //             {
  //               compress: 0.6,
  //               format: ImageManipulator.SaveFormat.PNG,
  //               base64: true,
  //             },
  //         );

  //         uri = `data:${result.assets[0].mimeType};base64,${manipulated.base64}`;*/

  //     if (Platform.OS === "android" || Platform.OS === "ios") {
  //       const base64 = await FileSystem.readAsStringAsync(
  //         result.assets[0].uri,
  //         {
  //           encoding: "base64",
  //         },
  //       );

  //       uri = `data:${result.assets[0].mimeType};base64,${base64}`;
  //     }

  //     onChange({
  //       uri: uri,
  //       mimeType: result.assets[0].mimeType,
  //       extension: obtenerExtension(result.assets[0].fileName),
  //     });
  //   }
  // };

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
          <View className="flex-row items-center gap-3">
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
          className={`${pregunta.categoriaPregunta === "I" && "flex-row items-center border-b border-gray-300"} gap-3  py-4`}
        >
          <View className="flex-row items-center gap-3">
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
            className={`${pregunta.categoriaPregunta === "I" && "flex-1"} items-center justify-center`}
          >
            <Controller
              control={control}
              name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
              defaultValue={false}
              // rules={{
              //   required: pregunta.obligatorio,
              // }}
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
    // case "B":
    //   return (
    //     <View
    //       className={`${pregunta.categoriaPregunta === "I" && "flex-row items-center border-b border-gray-300"} gap-3  py-4`}
    //     >
    //
    //         <PreguntaTitulo />
    //       <Controller
    //         control={control}
    //         name={`respuestas.${Number(pregunta.codigo)}.codPregunta`}
    //         defaultValue={pregunta.codigo}
    //         render={({ field: { value } }) => (
    //           <TextInput className={"hidden"} value={value} />
    //         )}
    //       />
    //       <Controller
    //         control={control}
    //         name={`respuestas.${Number(pregunta.codigo)}.respuesta`}
    //         render={({ field: { value, onChange } }) =>
    //           value &&
    //           typeof value === "object" &&
    //           "mimeType" in value &&
    //           value.mimeType?.includes("image") ? (
    //             <View
    //               className={`${pregunta.categoriaPregunta === "I" && "flex-1"} flex-row items-center gap-x-5`}
    //             >
    //               <Image
    //                 source={{ uri: value.uri }}
    //                 style={{ width: 100, height: 100 }}
    //               />
    //               <Pressable
    //                 onPress={() => deleteImage(onChange)}
    //                 className={
    //                   "bg-light-danger dark:bg-dark-danger p-2 rounded-lg justify-center items-center  " +
    //                   `${pregunta.categoriaPregunta === "I" && "w-auto"}`
    //                 }
    //               >
    //                 <CloseIcon />
    //               </Pressable>
    //             </View>
    //           ) : (
    //             <Pressable
    //               onPress={() => takePhoto(onChange)}
    //               className={
    //                 "bg-light-primary dark:bg-dark-primary p-2 rounded-lg justify-center items-center " +
    //                 `${pregunta.categoriaPregunta === "I" && "flex-1"}`
    //               }
    //             >
    //               <CameraIcon />
    //             </Pressable>
    //           )
    //         }
    //       />
    //     </View>
    //   );
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
            onRequestClose={() => {
              setCameraReady(false);

              setTimeout(() => {
                setCameraVisible(false);
              }, 100);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
              }}
            >
              <CameraView
                ref={cameraRef}
                style={{
                  flex: 1,
                }}
                facing="back"
                autofocus="on"
                animateShutter
                onCameraReady={() => {
                  setCameraReady(true);
                }}
              />

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
                  onPress={() => {
                    setCameraVisible(false);
                    setCameraReady(false);
                  }}
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
            <View className="flex-row items-center gap-3">
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

                    {/* <Pressable
                  onPress={() => deleteImage(onChange)}
                  className={
                    "bg-light-danger dark:bg-dark-danger p-2 rounded-lg justify-center items-center " +
                    `${pregunta.categoriaPregunta === "I" && "w-auto"}`
                  }
                >
                  <CloseIcon />
                </Pressable> */}
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
          <View className="flex-row items-center gap-3">
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
              /* <TextInput
                className={
                  "py-5 bg-white rounded-md px-3 font-semibold text-lg border" +
                  " border-[#D0D0D0]" +
                  `${pregunta.categoriaPregunta === "I" && "flex-1"}`
                }
                inputMode={"decimal"}
                value={ typeof value === 'string'  ||  typeof value === 'number' ? value.toString() : ""}
                onChangeText={(text) => {
                  const num = text === "" ? null : Number(text);
                  onChange(num);
                }}
              />*/
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

                  // const regex = /^-?\d*\.?\d*$/
                  //
                  // if (!regex.test(text)) return
                  //
                  //
                  // if (text === "" || text === "-" || text === "." || text === "-.") {
                  //   onChange(text)
                  // } else {
                  //   onChange(Number(text))
                  // }
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
