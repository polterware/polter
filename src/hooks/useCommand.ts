import { useState, useCallback } from "react";
import {
  runCommand,
  runSupabaseCommand,
  type CommandExecution,
  type RunResult,
} from "../lib/runner.js";

export type CommandStatus = "idle" | "running" | "success" | "error";

export function useCommand(
  execution: string | CommandExecution = "supabase",
  cwd: string = process.cwd(),
) {
  const [status, setStatus] = useState<CommandStatus>("idle");
  const [result, setResult] = useState<RunResult | null>(null);

  const run = useCallback(async (args: string[]) => {
    setStatus("running");
    setResult(null);

    const res =
      execution === "supabase"
        ? await runSupabaseCommand(args, cwd)
        : await runCommand(execution, args, cwd);
    setResult(res);

    if (res.spawnError || (res.exitCode !== null && res.exitCode !== 0)) {
      setStatus("error");
    } else {
      setStatus("success");
    }

    return res;
  }, [cwd, execution]);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
  }, []);

  return { status, result, run, reset };
}
