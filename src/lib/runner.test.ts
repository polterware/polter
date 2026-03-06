import { afterEach, describe, expect, it } from "vitest";
import { delimiter, join } from "node:path";
import { tmpdir } from "node:os";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import {
  findLocalSupabaseBinDir,
  resolveSupabaseCommand,
} from "./runner.js";

const tempDirs: string[] = [];

function createTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "polter-runner-"));
  tempDirs.push(dir);
  return dir;
}

function createLocalSupabaseInstall(rootDir: string): string {
  const binDir = join(rootDir, "node_modules", ".bin");
  const binaryName = process.platform === "win32" ? "supabase.cmd" : "supabase";

  mkdirSync(binDir, { recursive: true });
  writeFileSync(join(binDir, binaryName), "");

  return binDir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("findLocalSupabaseBinDir", () => {
  it("finds the nearest repository-local supabase binary", () => {
    const rootDir = createTempDir();
    const binDir = createLocalSupabaseInstall(rootDir);
    const nestedDir = join(rootDir, "apps", "web");

    mkdirSync(nestedDir, { recursive: true });

    expect(findLocalSupabaseBinDir(nestedDir)).toBe(binDir);
  });

  it("returns undefined when no repository-local supabase binary exists", () => {
    const rootDir = createTempDir();
    const nestedDir = join(rootDir, "apps", "web");

    mkdirSync(nestedDir, { recursive: true });

    expect(findLocalSupabaseBinDir(nestedDir)).toBeUndefined();
  });
});

describe("resolveSupabaseCommand", () => {
  it("prepends the repository-local bin directory to PATH", () => {
    const rootDir = createTempDir();
    const binDir = createLocalSupabaseInstall(rootDir);
    const nestedDir = join(rootDir, "packages", "cli");
    const env = { PATH: "/usr/bin" };

    mkdirSync(nestedDir, { recursive: true });

    const resolution = resolveSupabaseCommand(nestedDir, env);

    expect(resolution.source).toBe("repository");
    expect(resolution.localBinDir).toBe(binDir);
    expect(resolution.env.PATH).toBe(`${binDir}${delimiter}/usr/bin`);
    expect(env.PATH).toBe("/usr/bin");
  });

  it("falls back to PATH when no repository-local binary exists", () => {
    const rootDir = createTempDir();
    const nestedDir = join(rootDir, "packages", "cli");
    const env = { PATH: "/usr/bin" };

    mkdirSync(nestedDir, { recursive: true });

    const resolution = resolveSupabaseCommand(nestedDir, env);

    expect(resolution.source).toBe("path");
    expect(resolution.localBinDir).toBeUndefined();
    expect(resolution.env.PATH).toBe("/usr/bin");
  });
});
