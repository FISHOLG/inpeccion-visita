import React from "react";
import RegInspeccion from "@/presentation/components/vehicular/RegInspeccion";
import ThemedView from "@/presentation/shared/ThemedView";

const vehicularS = () => {
  return (
    <ThemedView safeb>
      <RegInspeccion tipo={"S"} />
    </ThemedView>
  );
};

export default vehicularS;
