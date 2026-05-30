import React from "react";
import { Text, View } from "react-native";

interface Props {
  message: string;
}

const ErrorValid = ({ message }: Props) => {
  return (
    <View className="py-3 bg-red-700 w-full">
      <Text className="text-white text-center text-xl">
        {message.toUpperCase()}
      </Text>
    </View>
  );
};

export default ErrorValid;
