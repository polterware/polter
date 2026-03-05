import { useState, useCallback } from "react";

export type Screen =
  | "main-menu"
  | "command-args"
  | "custom-command"
  | "flag-selection"
  | "command-execution"
  | "confirm-execute"
  | "self-update";

export interface NavigationParams {
  command?: string;
  args?: string[];
  flags?: string[];
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
