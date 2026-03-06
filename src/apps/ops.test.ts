import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { opsProfile } from "./ops.js";

const tempDirs: string[] = [];

function createOpsFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "polter-ops-test-"));
  tempDirs.push(root);

  mkdirSync(join(root, "src-tauri"), { recursive: true });
  mkdirSync(join(root, "supabase", "migrations"), { recursive: true });
  writeFileSync(join(root, "src-tauri", "tauri.conf.json"), "{}\n");
  writeFileSync(join(root, "package.json"), '{ "name": "ops-desktop" }\n');

  return root;
}

describe("opsProfile", () => {
  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it("detects the project root directly", () => {
    const root = createOpsFixture();
    expect(opsProfile.detect(root)).toBe(root);
  });

  it("resolves a sibling ops folder from a parent directory", () => {
    const marketRoot = mkdtempSync(join(tmpdir(), "polter-market-test-"));
    tempDirs.push(marketRoot);

    const opsRoot = join(marketRoot, "ops");
    mkdirSync(join(opsRoot, "src-tauri"), { recursive: true });
    mkdirSync(join(opsRoot, "supabase", "migrations"), { recursive: true });
    writeFileSync(join(opsRoot, "src-tauri", "tauri.conf.json"), "{}\n");
    writeFileSync(join(opsRoot, "package.json"), '{ "name": "ops-desktop" }\n');

    expect(opsProfile.resolveProjectRoot(marketRoot)).toBe(opsRoot);
  });
});
