import Conf from "conf";

const config = new Conf({ projectName: "polterbase" });

const PINS_KEY = "pinnedCommands";

export function getPinnedCommands(): string[] {
  return (config.get(PINS_KEY) as string[]) || [];
}

export function addPinnedCommand(cmd: string): void {
  const current = getPinnedCommands();
  if (!current.includes(cmd)) {
    config.set(PINS_KEY, [...current, cmd]);
  }
}

export function removePinnedCommand(cmd: string): void {
  const current = getPinnedCommands();
  config.set(
    PINS_KEY,
    current.filter((c) => c !== cmd),
  );
}

export function isPinned(cmd: string): boolean {
  return getPinnedCommands().includes(cmd);
}
