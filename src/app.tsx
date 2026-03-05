import React from "react";
import { Box, Text, useApp } from "ink";
import pc from "picocolors";
import { useNavigation } from "./hooks/useNavigation.js";
import { MainMenu } from "./screens/MainMenu.js";
import { CategoryCommands } from "./screens/CategoryCommands.js";
import { CustomCommand } from "./screens/CustomCommand.js";
import { FlagSelection } from "./screens/FlagSelection.js";
import { ManagePins } from "./screens/ManagePins.js";
import { CommandExecution } from "./screens/CommandExecution.js";

export function App(): React.ReactElement {
  const { screen, params, navigate, goBack } = useNavigation();
  const { exit } = useApp();

  const handleExit = () => {
    process.stdout.write(
      "\n" +
      pc.dim("Thank you for using ") +
      pc.cyan(pc.bold("Polterbase")) +
      pc.dim("!") +
      "\n\n",
    );
    exit();
  };

  switch (screen) {
    case "main-menu":
      return <MainMenu onNavigate={navigate} onExit={handleExit} />;

    case "category-commands":
      return (
        <CategoryCommands
          categoryKey={params.categoryKey ?? ""}
          onNavigate={navigate}
          onBack={goBack}
        />
      );

    case "custom-command":
      return <CustomCommand onNavigate={navigate} onBack={goBack} />;

    case "flag-selection":
      return (
        <FlagSelection
          args={params.args ?? []}
          onNavigate={navigate}
          onBack={goBack}
        />
      );

    case "manage-pins":
      return <ManagePins onBack={goBack} />;

    case "confirm-execute":
    case "command-execution":
      return (
        <CommandExecution
          args={params.args ?? []}
          isPinnedExec={params.isPinnedExec}
          onNavigate={navigate}
          onBack={goBack}
          onExit={handleExit}
        />
      );

    default:
      return (
        <Box>
          <Text color="red">Unknown screen: {screen}</Text>
        </Box>
      );
  }
}
