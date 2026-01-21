import React from "react";
import ThemedView from "@/presentation/shared/ThemedView";
import RegInspeccion from "@/presentation/components/vehicular/RegInspeccion";

const vehicularI = () => {
  return (
    <ThemedView safeb>
      <RegInspeccion tipo={"I"} />
    </ThemedView>
  );
};

export default vehicularI;
