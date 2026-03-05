import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

export interface SelectItem {
  value: string;
  label: string;
  hint?: string;
  isHeader?: boolean;
  icon?: string;
}

interface SelectListProps {
  items: SelectItem[];
  onSelect: (value: string) => void;
  onCancel?: () => void;
  maxVisible?: number;
}

export function SelectList({
  items,
  onSelect,
  onCancel,
  maxVisible = 12,
}: SelectListProps): React.ReactElement {
  const selectableItems = items.filter((item) => !item.isHeader);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => {
        let next = prev - 1;
        if (next < 0) next = selectableItems.length - 1;
        return next;
      });
    }

    if (key.downArrow || input === "j") {
      setSelectedIndex((prev) => {
        let next = prev + 1;
        if (next >= selectableItems.length) next = 0;
        return next;
      });
    }

    if (key.return) {
      const item = selectableItems[selectedIndex];
      if (item) {
        onSelect(item.value);
      }
    }

    if (key.escape && onCancel) {
      onCancel();
    }
  });

  // Calculate scroll window
  const scrollStart = Math.max(
    0,
    Math.min(
      selectedIndex - Math.floor(maxVisible / 2),
      selectableItems.length - maxVisible,
    ),
  );
  const visibleSelectables = selectableItems.slice(
    scrollStart,
    scrollStart + maxVisible,
  );

  // Build display items with headers
  const displayItems: (SelectItem & { isSelected: boolean; globalIndex: number })[] = [];

  let selectableCounter = 0;
  for (const item of items) {
    if (item.isHeader) {
      // Only show header if any of its children are visible
      const headerVisible = items
        .slice(items.indexOf(item) + 1)
        .some((child) => {
          if (child.isHeader) return false;
          const childIdx = selectableItems.indexOf(child);
          return visibleSelectables.includes(child) && childIdx >= 0;
        });
      if (headerVisible) {
        displayItems.push({ ...item, isSelected: false, globalIndex: -1 });
      }
    } else {
      if (visibleSelectables.includes(item)) {
        displayItems.push({
          ...item,
          isSelected: selectableCounter + scrollStart === selectedIndex,
          globalIndex: selectableCounter + scrollStart,
        });
      }
      selectableCounter++;
      if (selectableCounter >= scrollStart + maxVisible && selectableCounter > scrollStart) {
        // We've passed the visible window for counting
      }
    }
  }

  // Simpler approach: just render visible selectables with selection state
  const showScrollUp = scrollStart > 0;
  const showScrollDown = scrollStart + maxVisible < selectableItems.length;

  return (
    <Box flexDirection="column">
      {showScrollUp && (
        <Text dimColor>  ↑ more</Text>
      )}

      {selectableItems
        .slice(scrollStart, scrollStart + maxVisible)
        .map((item, i) => {
          const globalIdx = scrollStart + i;
          const isSelected = globalIdx === selectedIndex;

          return (
            <Box key={item.value} gap={1}>
              <Text color={isSelected ? "cyan" : undefined}>
                {isSelected ? "❯" : " "}
              </Text>
              <Text
                color={isSelected ? "cyan" : undefined}
                bold={isSelected}
              >
                {item.icon ? `${item.icon} ` : ""}{item.label}
              </Text>
              {item.hint && (
                <Text dimColor>{item.hint}</Text>
              )}
            </Box>
          );
        })}

      {showScrollDown && (
        <Text dimColor>  ↓ more</Text>
      )}
    </Box>
  );
}
