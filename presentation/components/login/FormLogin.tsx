import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Href, router } from "expo-router";

import { palette } from "@/constants/Colors";
import { cx, elevation } from "@/constants/Theme";
import {
  BadgeIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  LoginIcon,
  SpinnerIcon,
} from "@/constants/Icons";
import { IniciarSesion } from "@/core/services/Auth.service";
import { useAuthContext } from "@/core/stores/AuthContext.store";
import { LoginForm } from "@/infraestructure/interfaces/formularios.interface";
import { Auth } from "@/infraestructure/interfaces/main.interface";
import ErrorValid from "@/presentation/shared/ErrorValid";
import ThemedButton from "@/presentation/shared/ThemedButton";
import ThemedText from "@/presentation/shared/ThemedText";

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

    try {
      const peticion = await IniciarSesion(datos);

      if ("error" in peticion) {
        setErrorLogin(peticion.error);
        return;
      }

      const dataUsuario = peticion as Auth;
      logIn(dataUsuario);

      setErrorLogin("");

      let ruta = "/inspector";

      router.replace(ruta as Href);

      reset();
    } catch (error: any) {
      console.log("ERROR AL INICIAR SESION:", error);
      setErrorLogin(error?.message ?? "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  const campoBase =
    "flex-row items-center gap-x-3 rounded-xl border bg-app-surfaceAlt px-4";

  return (
    <View
      className="gap-y-5 rounded-3xl border border-app-border bg-app-surface p-6"
      style={elevation(2)}
    >
      <View className="gap-y-1">
        <ThemedText type="h2" className="text-app-textMain">
          Iniciar sesion
        </ThemedText>
        <ThemedText type="caption" className="text-app-textSecond">
          Ingrese sus credenciales de inspector
        </ThemedText>
      </View>

      <View className="gap-y-2">
        <ThemedText type="label" className="text-app-textSecond">
          Usuario
        </ThemedText>
        <Controller
          control={control}
          name={"usuario"}
          rules={{
            required: "El usuario es obligatorio",
          }}
          render={({ field: { onChange, value } }) => (
            <View
              className={cx(
                campoBase,
                errors.usuario ? "border-app-danger" : "border-app-border",
              )}
            >
              <BadgeIcon size={22} />
              <TextInput
                className="flex-1 py-4 text-base font-semibold text-app-textMain"
                placeholder="Codigo de usuario"
                placeholderTextColor={palette.textMuted}
                maxLength={6}
                autoCapitalize={"none"}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
        />
      </View>

      <View className="gap-y-2">
        <ThemedText type="label" className="text-app-textSecond">
          Contrasena
        </ThemedText>
        <Controller
          control={control}
          name={"clave"}
          render={({ field: { onChange, value } }) => (
            <View className={cx(campoBase, "border-app-border")}>
              <LockIcon size={22} />
              <TextInput
                className="flex-1 py-4 text-base font-semibold text-app-textMain"
                placeholder="••••••"
                placeholderTextColor={palette.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize={"none"}
                onChangeText={onChange}
                value={value}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                }
                className="p-1 active:opacity-60"
              >
                {showPassword ? (
                  <EyeOffIcon size={24} />
                ) : (
                  <EyeIcon size={24} />
                )}
              </Pressable>
            </View>
          )}
        />
      </View>

      <ThemedButton
        size="lg"
        block
        variant="primary"
        disabled={loading}
        onPress={handleSubmit(onLogin)}
        icon={
          loading ? (
            <SpinnerIcon size={22} />
          ) : (
            <LoginIcon size={22} color={palette.onPrimary} />
          )
        }
      >
        {loading ? "Ingresando..." : "Ingresar"}
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
