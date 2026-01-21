import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Checkbox } from "@futurejj/react-native-checkbox";
import ThemedButton from "@/presentation/shared/ThemedButton";
import ThemedText from "@/presentation/shared/ThemedText";
import { useForm, Controller } from "react-hook-form";
import { LoginForm } from "@/infraestructure/interfaces/formularios.interface";
import { SpinnerIcon } from "@/constants/Icons";
import { IniciarSesion } from "@/core/services/Auth.service";
import { Href, router } from "expo-router";
import { Auth } from "@/infraestructure/interfaces/main.interface";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import ErrorValid from "@/presentation/shared/ErrorValid";

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [loading, setLoading] = useState(false);

  const { logIn } = useAuthContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      usuario: "",
      clave: "",
    },
  });

  const onLogin = async (datos: LoginForm) => {
    setLoading(true);

    const peticion = await IniciarSesion(datos);

    if ("error" in peticion) {
      setErrorLogin(peticion.error);
      setLoading(false);
      return;
    }

    const dataUsuario = peticion as Auth;
    logIn(dataUsuario);

    setErrorLogin("");

    let ruta = "/inspector";

    router.replace(ruta as Href);

    setLoading(false);
    reset();
  };

  return (
    <View
      className={
        " bg-gray-200 dark:bg-gray-600 border-light-background dark:border-dark-background w-4/5 lg:w-2/3 px-5" +
          " lg:px-10" +
          " py-5 lg:py-14" +
        " rounded-2xl" +
        " gap-y-4"
      }
    >
      <ThemedText
        type={"h1"}
        className={
          "text-center text-light-primary dark:text-dark-primary px-3"
        }
      >
        Inspeccion Vehicular
      </ThemedText>

      <Controller
        control={control}
        name={"usuario"}
        rules={{
          required: "El usuario es obligatorio",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={
              " text-sm md:text-base lg:text-lg py-3 lg:py-5 px-3 border-b border-light-background" +
                " text-light-textMain" +
              " dark:text-dark-textMain w-full placeholder:text-gray-300 rounded-xl"
            }
            placeholder={"Usuario"}
            maxLength={6}
            autoCapitalize={"none"}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <Controller
        control={control}
        name={"clave"}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={
              "text-sm md:text-base lg:text-lg py-3 lg:py-5 px-3 border-b border-light-background text-light-textMain" +
              " dark:text-dark-textMain w-full placeholder:text-gray-300 rounded-xl"
            }
            placeholder={"contraseña"}
            secureTextEntry={!showPassword}
            autoCapitalize={"none"}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <View className={"flex-row gap-x-2 items-center"}>
        <Checkbox
          status={showPassword ? "checked" : "unchecked"}
          onPress={() => setShowPassword(!showPassword)}
          size={30}
        />
        <ThemedText type={"semi-bold"}>Mostrar contraseña</ThemedText>
      </View>

      <ThemedButton
        className={"uppercase bg-blue-500 dark:bg-blue-500 py-5"}
        onPress={handleSubmit(onLogin)}
      >
        {loading ? <SpinnerIcon size={20} /> : <> INGRESAR</>}
      </ThemedButton>

        {errors.usuario && (
            <ErrorValid
                message={errors.usuario.message ? errors.usuario.message : ""}
            />
        )}
        {errorLogin !== "" && <ErrorValid message={errorLogin.toUpperCase()} />}
    </View>
  );
};

export default FormLogin;
