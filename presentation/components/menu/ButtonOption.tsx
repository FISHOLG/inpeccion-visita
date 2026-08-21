import React from "react";
import { View } from "react-native";
import { Href, router } from "expo-router";
import { ChevronRightIcon } from "@/constants/Icons";
import Card from "@/presentation/shared/Card";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  title: string;
  subtitle?: string;
  icon: React.ReactElement;
  color: string;
  ruta: string;
}

const ButtonOption = ({ title, subtitle, icon, color, ruta }: Props) => {
  const navegar = () => {
    router.push(ruta as Href);
  };

  return (
    <Card onPress={navegar} accentColor={color} level={2}>
      <View className="flex-row items-center gap-x-4 px-4 py-5">
        <View
          className="h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </View>

        <View className="flex-1 gap-y-1">
          <ThemedText type="h3" className="uppercase text-app-textMain">
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" className="text-app-textSecond">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>

        <ChevronRightIcon size={28} />
      </View>
    </Card>
  );
};

export default ButtonOption;
