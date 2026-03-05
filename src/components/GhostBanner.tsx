import React from "react";
import { Box, Text } from "ink";
import { ghost as ghostData, VERSION } from "../theme.js";

export function GhostBanner(): React.ReactElement {
  return (
    <Box flexDirection="row" alignItems="flex-start" gap={2} marginBottom={1}>
      <Box flexDirection="column">
        {ghostData.art.map((line, i) => (
          <Text key={i} color="cyan">
            {line}
          </Text>
        ))}
      </Box>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="cyan"
        paddingX={1}
      >
        <Text backgroundColor="cyan" color="black" bold>
          {" POLTERBASE "}
        </Text>
        <Text dimColor>Version: {VERSION}</Text>
        <Text dimColor>The modern interactive CLI for Supabase</Text>
      </Box>
    </Box>
  );
}
