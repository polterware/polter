import React from "react";
import { Box, Text } from "ink";
import { ghost as ghostData, inkColors, VERSION } from "../theme.js";
import { getToolLinkInfo } from "../lib/toolResolver.js";

interface GhostBannerProps {
  width?: number;
  compact?: boolean;
}

const ToolStatusBadges = React.memo(function ToolStatusBadges(): React.ReactElement {
  const tools = (["supabase", "gh", "vercel"] as const).map((id) => getToolLinkInfo(id));
  return (
    <Box gap={1}>
      {tools.map((t) => (
        <Text
          key={t.id}
          color={t.linked ? inkColors.accent : t.installed ? "yellow" : "red"}
          dimColor={!t.installed}
        >
          {t.id}:{t.linked ? "linked" : t.installed ? "ok" : "x"}
        </Text>
      ))}
    </Box>
  );
});

export function GhostBanner({ width = 80, compact = false }: GhostBannerProps): React.ReactElement {
  if (compact) {
    if (width < 60) {
      return (
        <Box>
          <Text color={inkColors.accent} bold>POLTER</Text>
          <Text dimColor> v{VERSION}  </Text>
          <ToolStatusBadges />
        </Box>
      );
    }

    // Compact: original ghost art + info on the right
    return (
      <Box flexDirection="row" gap={2}>
        <Box flexDirection="column">
          {ghostData.art.map((line, i) => (
            <Text key={i} color={inkColors.accent}>{line}</Text>
          ))}
        </Box>
        <Box flexDirection="column" justifyContent="center">
          <Text color={inkColors.accent} bold>POLTER</Text>
          <Text dimColor>v{VERSION}</Text>
          <ToolStatusBadges />
        </Box>
      </Box>
    );
  }

  if (width < 50) {
    return (
      <Box marginBottom={1}>
        <Text color={inkColors.accent} bold>POLTER</Text>
        <Text dimColor> v{VERSION}</Text>
      </Box>
    );
  }

  if (width < 80) {
    return (
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor={inkColors.accent}
        paddingX={1}
        marginBottom={1}
      >
        <Text
          backgroundColor={inkColors.accent}
          color={inkColors.accentContrast}
          bold
        >
          {" POLTER "}
        </Text>
        <Text dimColor>Version: {VERSION}</Text>
        <Text dimColor>Project & infrastructure orchestrator</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" alignItems="flex-start" gap={2} marginBottom={1}>
      <Box flexDirection="column">
        {ghostData.art.map((line, i) => (
          <Text key={i} color={inkColors.accent}>
            {line}
          </Text>
        ))}
      </Box>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor={inkColors.accent}
        paddingX={1}
      >
        <Text
          backgroundColor={inkColors.accent}
          color={inkColors.accentContrast}
          bold
        >
          {" POLTER "}
        </Text>
        <Text dimColor>Version: {VERSION}</Text>
        <Text dimColor>Project & infrastructure orchestrator</Text>
      </Box>
    </Box>
  );
}
