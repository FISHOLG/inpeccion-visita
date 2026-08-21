import React from "react";
import { View } from "react-native";
import { InboxEmptyIcon } from "@/constants/Icons";
import ThemedText from "@/presentation/shared/ThemedText";

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState = ({ title, description, icon }: Props) => (
  <View className="items-center justify-center gap-y-3 px-8 py-16">
    <View className="h-20 w-20 items-center justify-center rounded-full bg-app-surfaceAlt">
      {icon ?? <InboxEmptyIcon size={38} />}
    </View>
    <ThemedText type="h3" className="text-center uppercase text-app-textSecond">
      {title}
    </ThemedText>
    {description ? (
      <ThemedText type="caption" className="text-center text-app-textMuted">
        {description}
      </ThemedText>
    ) : null}
  </View>
);

export default EmptyState;
