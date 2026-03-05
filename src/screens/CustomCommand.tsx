import React from "react";
import { Box } from "ink";
import { TextPrompt } from "../components/TextPrompt.js";
import { StatusBar } from "../components/StatusBar.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";

interface CustomCommandProps {
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onBack: () => void;
}

export function CustomCommand({
  onNavigate,
  onBack,
}: CustomCommandProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <TextPrompt
        label="Enter your Supabase command/flags:"
        placeholder="e.g. -v, status -o json, db pull"
        validate={(val) => {
          if (!val || !val.trim()) return "Please enter a command";
          return undefined;
        }}
        onSubmit={(value) => {
          const args = value.split(" ").filter(Boolean);
          onNavigate("flag-selection", { args });
        }}
        onCancel={onBack}
      />

      <StatusBar hint="Type a command · Enter to continue · Esc to go back" />
    </Box>
  );
}
