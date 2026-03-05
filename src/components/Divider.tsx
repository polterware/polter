import React from "react";
import { Box, Text } from "ink";

interface DividerProps {
  label?: string;
  width?: number;
}

export function Divider({
  label,
  width = 50,
}: DividerProps): React.ReactElement {
  if (label) {
    const labelLen = label.length + 2; // space padding
    const sideLen = Math.max(2, Math.floor((width - labelLen) / 2));
    const left = "─".repeat(sideLen);
    const right = "─".repeat(sideLen);

    return (
      <Text dimColor>
        {left} {label} {right}
      </Text>
    );
  }

  return <Text dimColor>{"─".repeat(width)}</Text>;
}
