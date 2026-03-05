import { useState, useCallback } from "react";
import { runSupabaseCommand, type RunResult } from "../lib/runner.js";

export type CommandStatus = "idle" | "running" | "success" | "error";

export function useCommand() {
  const [status, setStatus] = useState<CommandStatus>("idle");
  const [result, setResult] = useState<RunResult | null>(null);

  const run = useCallback(async (args: string[]) => {
    setStatus("running");
    setResult(null);

    const res = await runSupabaseCommand(args);
    setResult(res);

    if (res.spawnError || (res.exitCode !== null && res.exitCode !== 0)) {
      setStatus("error");
    } else {
      setStatus("success");
    }

    return res;
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
  }, []);

  return { status, result, run, reset };
}
