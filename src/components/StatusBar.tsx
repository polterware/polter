import React from "react";
import { Box, Text } from "ink";
import { VERSION } from "../theme.js";

interface StatusBarProps {
  hint?: string;
}

export function StatusBar({ hint }: StatusBarProps): React.ReactElement {
  return (
    <Box marginTop={1} justifyContent="space-between">
      <Text dimColor>
        {hint || "↑↓ navigate · Enter select · Esc back"}
      </Text>
      <Text dimColor>
        polterbase v{VERSION}
      </Text>
    </Box>
  );
}
