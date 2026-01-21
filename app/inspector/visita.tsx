import React from "react";
import ThemedView from "@/presentation/shared/ThemedView";
import ListPendientes from "@/presentation/components/visita/ListPendientes";
const visita = () => {
  return (
      <ThemedView safeb>
      <ListPendientes/>
    </ThemedView>
  );
};

export default visita;
