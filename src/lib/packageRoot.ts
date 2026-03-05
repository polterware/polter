import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export function findNearestPackageRoot(
  startDir: string = process.cwd(),
): string | undefined {
  let currentDir = resolve(startDir);

  while (true) {
    if (existsSync(join(currentDir, "package.json"))) {
      return currentDir;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
}
