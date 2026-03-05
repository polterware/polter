import React, { useState } from "react";
import { Box, Text } from "ink";
import { SelectList, type SelectItem } from "../components/SelectList.js";
import { TextPrompt } from "../components/TextPrompt.js";
import { StatusBar } from "../components/StatusBar.js";
import { categories, getCommandOptions } from "../data/commands.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";

interface CategoryCommandsProps {
  categoryKey: string;
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onBack: () => void;
}

type Phase = "select-command" | "extra-args";

export function CategoryCommands({
  categoryKey,
  onNavigate,
  onBack,
}: CategoryCommandsProps): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("select-command");
  const [selectedCommand, setSelectedCommand] = useState<string>("");

  const cat = categories[categoryKey];
  if (!cat) {
    return (
      <Box>
        <Text color="red">Category not found: {categoryKey}</Text>
      </Box>
    );
  }

  if (phase === "extra-args") {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1} gap={1}>
          <Text color="cyan" bold>
            {cat.icon}
          </Text>
          <Text bold>{cat.label}</Text>
          <Text dimColor>→</Text>
          <Text color="cyan">{selectedCommand}</Text>
        </Box>

        <TextPrompt
          label={`Additional args for supabase ${selectedCommand}?`}
          placeholder="e.g. push, pull, list (Enter to skip)"
          onSubmit={(extra) => {
            const args = [selectedCommand];
            if (extra.trim()) {
              args.push(
                ...extra
                  .trim()
                  .split(" ")
                  .filter(Boolean),
              );
            }
            onNavigate("flag-selection", { args, command: selectedCommand });
          }}
          onCancel={() => setPhase("select-command")}
        />

        <StatusBar hint="Type args · Enter to continue · Esc to go back" />
      </Box>
    );
  }

  const commandOpts = getCommandOptions(categoryKey);
  const items: SelectItem[] = [
    { value: "__back__", label: "← Back to menu", icon: "" },
    ...commandOpts.map((cmd) => ({
      value: cmd.value,
      label: cmd.label,
      hint: cmd.hint,
    })),
  ];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} gap={1}>
        <Text color="cyan" bold>
          {cat.icon}
        </Text>
        <Text bold>{cat.label}</Text>
        <Text dimColor>— {cat.description}</Text>
      </Box>

      <SelectList
        items={items}
        onSelect={(value) => {
          if (value === "__back__") {
            onBack();
            return;
          }
          setSelectedCommand(value);
          setPhase("extra-args");
        }}
        onCancel={onBack}
      />

      <StatusBar />
    </Box>
  );
}
