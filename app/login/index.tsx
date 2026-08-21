import IconLogin from "@/assets/images/login/IconLogin.png";
import { palette } from "@/constants/Colors";
import { elevation } from "@/constants/Theme";
import FormLogin from "@/presentation/components/login/FormLogin";
import ThemedText from "@/presentation/shared/ThemedText";
import ThemedView from "@/presentation/shared/ThemedView";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

const index = () => {
  return (
    <ThemedView safeb>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="items-center gap-y-3 rounded-b-[36px] px-6 pb-20 pt-16"
            style={{ backgroundColor: palette.primaryDeep }}
          >
            <View
              className="h-24 w-24 items-center justify-center rounded-3xl bg-white p-3"
              style={elevation(2)}
            >
              <Image
                source={IconLogin}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>

            <ThemedText type="h1" className="text-center text-white">
              Inspeccion Vehicular
            </ThemedText>

            <View
              className="rounded-full px-4 py-1"
              style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
            >
              <ThemedText
                type="caption"
                className="text-center uppercase tracking-widest text-white"
              >
                Control de ingreso y salida de unidades
              </ThemedText>
            </View>
          </View>

          <View className="-mt-12 flex-1 justify-start px-5 pb-8">
            <FormLogin />
          </View>

          <View className="items-center pb-4">
            <ThemedText type="caption" className="text-app-textMuted">
              v1.0.0 · Refrigerados Fisholg & Hijos S.A.C
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default index;
