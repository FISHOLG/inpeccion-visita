import React from "react";
import { Pressable } from "react-native";
import ThemedText from "@/presentation/shared/ThemedText";
import { Href, router } from "expo-router";

interface Props {
  title: string;
  icon: React.ReactElement;
  color: string;
  ruta: string;
}

const ButtonOption = ({ title, icon, color, ruta }: Props) => {
  const navegar = () => {
    router.push(ruta as Href);
  };
  return (
    <Pressable
      onPress={navegar}
      className={
        "flex-row items-center py-6 rounded-2xl px-5 gap-x-5 active:opacity-60"
      }
      style={{ backgroundColor: color, borderColor: color }}
    >
      {icon}
      <ThemedText type={"h1"} className={'flex-1'} >{title}</ThemedText>
    </Pressable>
  );
};

export default ButtonOption;
