import React from "react";
import { Box } from "ink";
import { FlagToggle } from "../components/FlagToggle.js";
import { StatusBar } from "../components/StatusBar.js";
import { globalFlags } from "../data/flags.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";

interface FlagSelectionProps {
  args: string[];
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onBack: () => void;
}

export function FlagSelection({
  args,
  onNavigate,
  onBack,
}: FlagSelectionProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <FlagToggle
        flags={globalFlags}
        onSubmit={(selectedFlags) => {
          const finalArgs =
            selectedFlags.length > 0
              ? [...args, ...selectedFlags]
              : args;
          onNavigate("confirm-execute", { args: finalArgs });
        }}
        onCancel={onBack}
      />

      <StatusBar hint="Space toggle · Enter confirm · Esc back" />
    </Box>
  );
}
