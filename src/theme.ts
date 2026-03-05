import pc from "picocolors";

export const VERSION = "0.1.2";

export const colors = {
  primary: pc.cyan,
  primaryBold: (s: string) => pc.bold(pc.cyan(s)),
  accent: pc.magenta,
  accentBold: (s: string) => pc.bold(pc.magenta(s)),
  success: pc.green,
  successBold: (s: string) => pc.bold(pc.green(s)),
  error: pc.red,
  errorBold: (s: string) => pc.bold(pc.red(s)),
  warning: pc.yellow,
  warningBold: (s: string) => pc.bold(pc.yellow(s)),
  dim: pc.dim,
  bold: pc.bold,
  white: pc.white,
  highlight: (s: string) => pc.bgCyan(pc.black(pc.bold(s))),
};

export const symbols = {
  pointer: "›",
  pointerActive: "❯",
  check: "✓",
  cross: "✗",
  bullet: "●",
  bulletEmpty: "○",
  pin: "📌",
  ghost: "👻",
  exit: "🚪",
  edit: "✏️",
  gear: "⚙️",
  back: "←",
  arrowRight: "→",
  separator: "─",
  cornerTL: "╭",
  cornerTR: "╮",
  cornerBL: "╰",
  cornerBR: "╯",
  vertical: "│",
  horizontal: "─",
} as const;

export const ghost = {
  art: [
    "    ▄▄███████████▄▄",
    "   █                █",
    "  █   ▄██▄     ▂█▂   █",
    "  █   ▀██▀     ▔█▔   █",
    "  █                  █",
    "  █   ██ ██████ ██   █",
    "  █                  █",
    "  █▄██▀▀██▄▄▄▄██▀▀██▄█",
  ],
};
