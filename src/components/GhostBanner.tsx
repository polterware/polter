import React from "react";
import { Box, Text } from "ink";
import { colors, ghost as ghostData, VERSION } from "../theme.js";

export function GhostBanner(): React.ReactElement {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Box flexDirection="column">
        {ghostData.art.map((line, i) => (
          <Text key={i} color="cyan">
            {line}
          </Text>
        ))}
      </Box>

      <Box marginTop={1} gap={1}>
        <Text backgroundColor="cyan" color="black" bold>
          {" POLTERBASE "}
        </Text>
        <Text dimColor>v{VERSION}</Text>
      </Box>

      <Text dimColor>The modern interactive CLI for Supabase</Text>
    </Box>
  );
}
