import React, { useEffect, useMemo, useState } from "react";
import { Box, Text } from "ink";
import { SelectList, type SelectItem } from "./SelectList.js";
import { inkColors } from "../theme.js";
import {
  getPinnedCommands,
  getPinnedRuns,
  togglePinnedCommand,
  togglePinnedRun,
} from "../data/pins.js";
import { buildPinnedOnlyItems } from "../screens/homeModel.js";
import { findCommandByValue } from "../data/commands/index.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";

interface PinnedCommandsProps {
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onBack?: () => void;
  onPinsChanged?: () => void;
  width?: number;
  height?: number;
  isInputActive?: boolean;
}

export function PinnedCommands({
  onNavigate,
  onBack,
  onPinsChanged,
  width = 80,
  height = 24,
  isInputActive = true,
}: PinnedCommandsProps): React.ReactElement {
  const [pinnedCommands, setPinnedCommands] = useState<string[]>(() => getPinnedCommands());
  const [pinnedRuns, setPinnedRuns] = useState<string[]>(() => getPinnedRuns());
  const [pinFeedback, setPinFeedback] = useState<string>();

  useEffect(() => {
    if (!pinFeedback) return;
    const timeout = setTimeout(() => setPinFeedback(undefined), 1400);
    return () => clearTimeout(timeout);
  }, [pinFeedback]);

  const items = useMemo(
    () => buildPinnedOnlyItems(pinnedCommands, pinnedRuns),
    [pinnedCommands, pinnedRuns],
  );

  const pinnedCommandSet = useMemo(() => new Set(pinnedCommands), [pinnedCommands]);
  const pinnedRunSet = useMemo(() => new Set(pinnedRuns), [pinnedRuns]);

  const refreshPins = () => {
    setPinnedCommands(getPinnedCommands());
    setPinnedRuns(getPinnedRuns());
  };

  const handleSelect = (value: string, item?: SelectItem) => {
    if (!item) return;

    if (item.kind === "command") {
      const cmdDef = findCommandByValue(value);
      if (cmdDef) {
        onNavigate("command-args", {
          command: value,
          commandId: cmdDef.id,
          tool: cmdDef.tool,
        });
      } else {
        onNavigate("command-args", { command: value, tool: "supabase" });
      }
      return;
    }

    if (item.kind === "run") {
      const args = value.split(" ").filter(Boolean);
      if (args.length > 0) {
        const basePart = args[0] ?? "";
        const cmdDef = findCommandByValue(basePart);
        const tool = cmdDef?.tool ?? "supabase";
        onNavigate("confirm-execute", { args, tool });
      }
    }
  };

  const handleRightAction = (item: SelectItem) => {
    if (item.kind === "command") {
      const wasPinned = pinnedCommandSet.has(item.value);
      togglePinnedCommand(item.value);
      refreshPins();
      onPinsChanged?.();
      setPinFeedback(
        wasPinned ? `Unpinned "${item.value}"` : `Pinned "${item.value}"`,
      );
      return;
    }

    if (item.kind === "run") {
      const wasPinned = pinnedRunSet.has(item.value);
      togglePinnedRun(item.value);
      refreshPins();
      onPinsChanged?.();
      setPinFeedback(
        wasPinned
          ? `Unpinned run "${item.value}"`
          : `Pinned run "${item.value}"`,
      );
    }
  };

  if (items.length === 0) {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Text color="gray">
          No pinned items. Press p on any command to pin it.
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={1}>
      {pinFeedback && (
        <Box marginBottom={1}>
          <Text color={inkColors.accent}>✓ {pinFeedback}</Text>
        </Box>
      )}

      <SelectList
        items={items}
        onSelect={handleSelect}
        onRightAction={handleRightAction}
        boxedSections
        width={Math.max(20, width - 4)}
        maxVisible={Math.max(6, height - 6)}
        onCancel={onBack}
        isInputActive={isInputActive}
        arrowNavigation
        panelFocused={isInputActive}
      />
    </Box>
  );
}
