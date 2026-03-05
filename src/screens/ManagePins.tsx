import React, { useState } from "react";
import { Box, Text } from "ink";
import { SelectList, type SelectItem } from "../components/SelectList.js";
import { StatusBar } from "../components/StatusBar.js";
import { getPinnedCommands, removePinnedCommand } from "../data/pins.js";

interface ManagePinsProps {
  onBack: () => void;
}

export function ManagePins({ onBack }: ManagePinsProps): React.ReactElement {
  const [pinned, setPinned] = useState(getPinnedCommands());
  const [message, setMessage] = useState<string>();

  if (pinned.length === 0) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text dimColor>No pinned commands yet.</Text>
        </Box>

        <SelectList
          items={[{ value: "__back__", label: "← Back to menu" }]}
          onSelect={onBack}
          onCancel={onBack}
        />
      </Box>
    );
  }

  const items: SelectItem[] = [
    { value: "__back__", label: "← Back to menu" },
    ...pinned.map((cmd) => ({
      value: cmd,
      label: `📌 ${cmd}`,
      hint: "select to unpin",
    })),
  ];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📌 Manage Pinned Commands
        </Text>
      </Box>

      {message && (
        <Box marginBottom={1}>
          <Text color="green">✓ {message}</Text>
        </Box>
      )}

      <SelectList
        items={items}
        onSelect={(value) => {
          if (value === "__back__") {
            onBack();
            return;
          }
          removePinnedCommand(value);
          setPinned(getPinnedCommands());
          setMessage(`Unpinned "${value}"`);
        }}
        onCancel={onBack}
      />

      <StatusBar hint="Enter to unpin · Esc to go back" />
    </Box>
  );
}
