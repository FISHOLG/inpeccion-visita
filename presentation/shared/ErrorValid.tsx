import { View, Text } from "react-native";
import React from "react";

interface Props {
  message: string;
}

const ErrorValid = ({ message }: Props) => {
  return (
    <View className="py-3 bg-red-500 w-full">
      <Text className="text-white text-center text-xl">
        {message.toUpperCase()}
      </Text>
    </View>
  );
};

export default ErrorValid;
