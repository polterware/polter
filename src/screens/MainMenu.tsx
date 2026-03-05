import React from "react";
import { Box, Text } from "ink";
import { GhostBanner } from "../components/GhostBanner.js";
import { SelectList, type SelectItem } from "../components/SelectList.js";
import { StatusBar } from "../components/StatusBar.js";
import { Divider } from "../components/Divider.js";
import { getCategoryOptions } from "../data/commands.js";
import { getPinnedCommands } from "../data/pins.js";
import type { NavigationParams, Screen } from "../hooks/useNavigation.js";

interface MainMenuProps {
  onNavigate: (screen: Screen, params?: NavigationParams) => void;
  onExit: () => void;
}

export function MainMenu({
  onNavigate,
  onExit,
}: MainMenuProps): React.ReactElement {
  const pinned = getPinnedCommands();
  const categoryOptions = getCategoryOptions();

  const items: SelectItem[] = [];

  // Pinned commands section
  if (pinned.length > 0) {
    items.push({
      value: "__header_pins__",
      label: "📌 Pinned",
      isHeader: true,
    });
    for (const cmd of pinned) {
      items.push({
        value: `pin:${cmd}`,
        label: cmd,
        hint: "pinned",
        icon: "  ",
      });
    }
    items.push({
      value: "manage-pins",
      label: "Manage pinned commands",
      icon: "⚙️ ",
    });
  }

  // Categories
  if (pinned.length > 0) {
    items.push({
      value: "__header_cats__",
      label: "📂 Categories",
      isHeader: true,
    });
  }

  for (const catOpt of categoryOptions) {
    items.push({
      value: catOpt.value,
      label: catOpt.label,
      hint: catOpt.hint,
    });
  }

  // Custom + Exit
  items.push({
    value: "custom",
    label: "✏️  Custom Command",
    hint: "Free-form args or check version",
  });
  items.push({
    value: "exit",
    label: "🚪 Exit",
  });

  const handleSelect = (value: string) => {
    if (value === "exit") {
      onExit();
      return;
    }
    if (value === "manage-pins") {
      onNavigate("manage-pins");
      return;
    }
    if (value === "custom") {
      onNavigate("custom-command");
      return;
    }
    if (value.startsWith("pin:")) {
      const cmd = value.replace("pin:", "");
      const args = cmd.split(" ").filter(Boolean);
      onNavigate("confirm-execute", { args, isPinnedExec: true });
      return;
    }
    // Category selected
    onNavigate("category-commands", { categoryKey: value });
  };

  return (
    <Box flexDirection="column">
      <GhostBanner />

      <Box marginBottom={1}>
        <Text bold>
          {pinned.length > 0
            ? "Choose a pinned command or category:"
            : "What would you like to do?"}
        </Text>
      </Box>

      <SelectList items={items} onSelect={handleSelect} />

      <StatusBar />
    </Box>
  );
}
