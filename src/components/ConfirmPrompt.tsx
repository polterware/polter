import React from "react";
import { Box, Text, useInput } from "ink";

interface ConfirmPromptProps {
  message: string;
  defaultValue?: boolean;
  onConfirm: (value: boolean) => void;
}

export function ConfirmPrompt({
  message,
  defaultValue = true,
  onConfirm,
}: ConfirmPromptProps): React.ReactElement {
  useInput((input) => {
    if (input === "y" || input === "Y") {
      onConfirm(true);
    } else if (input === "n" || input === "N") {
      onConfirm(false);
    } else if (input === "\r") {
      onConfirm(defaultValue);
    }
  });

  return (
    <Box gap={1}>
      <Text color="cyan" bold>
        ?
      </Text>
      <Text>{message}</Text>
      <Text dimColor>
        {defaultValue ? "(Y/n)" : "(y/N)"}
      </Text>
    </Box>
  );
}
