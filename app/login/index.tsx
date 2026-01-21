import React from "react";
import { Image, KeyboardAvoidingView, View } from "react-native";
import ThemedView from "@/presentation/shared/ThemedView";
import FormLogin from "@/presentation/components/login/FormLogin";
import IconLogin from "@/assets/images/login/IconLogin.png";

const index = () => {
  return (
    <ThemedView safeb>
      <KeyboardAvoidingView
         // className={'sm:flex-row lg:flex-col'}
        style={{
          flex: 1,
          justifyContent: "center",
            //flexDirection:"row",
          alignItems: "center",
          gap: 20,
            paddingVertical:10
        }}
        behavior={"height"}
      >
          <View className={'flex-1 items-center justify-center'}>
            <Image source={IconLogin} style={{width:250 , height:250}}/>
          </View>
        <FormLogin />
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default index;
