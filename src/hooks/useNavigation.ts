import { useState, useCallback } from "react";

export type Screen =
  | "main-menu"
  | "category-commands"
  | "custom-command"
  | "flag-selection"
  | "manage-pins"
  | "command-execution"
  | "confirm-execute";

export interface NavigationParams {
  categoryKey?: string;
  command?: string;
  args?: string[];
  flags?: string[];
  isPinnedExec?: boolean;
}

export interface NavigationState {
  screen: Screen;
  params: NavigationParams;
}

export function useNavigation() {
  const [state, setState] = useState<NavigationState>({
    screen: "main-menu",
    params: {},
  });

  const navigate = useCallback((screen: Screen, params?: NavigationParams) => {
    setState({
      screen,
      params: params ?? {},
    });
  }, []);

  const goBack = useCallback(() => {
    setState({ screen: "main-menu", params: {} });
  }, []);

  return { screen: state.screen, params: state.params, navigate, goBack };
}
