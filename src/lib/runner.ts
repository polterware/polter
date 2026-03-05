import { spawn } from "node:child_process";

export interface RunResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  spawnError?: string;
}

export async function runSupabaseCommand(args: string[]): Promise<RunResult> {
  return new Promise<RunResult>((resolve) => {
    let stdout = "";
    let stderr = "";

    const child = spawn("supabase", args, {
      shell: true,
      stdio: ["inherit", "pipe", "pipe"],
    });

    child.stdout?.on("data", (data: Buffer) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr?.on("data", (data: Buffer) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("error", (err: Error) => {
      resolve({
        exitCode: null,
        signal: null,
        stdout,
        stderr,
        spawnError: err.message,
      });
    });

    child.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
      resolve({ exitCode: code, signal, stdout, stderr });
    });
  });
}
