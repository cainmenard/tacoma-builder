/**
 * Regenerates docs/index.html, the standalone single-file mirror that GitHub Pages
 * serves. It is the same app as the Next.js build: one esbuild bundle that mounts
 * `Page` into #root, plus the Tailwind stylesheet inlined, wrapped in a static shell.
 *
 * This used to be a manual process described in prose in the README, which meant the
 * mirror silently drifted from `src/data/arms.ts` every time the dataset changed.
 *
 *   npm run build:mirror
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = mkdtempSync(join(tmpdir(), "uca-mirror-"));

/**
 * The static shell. Kept byte-for-byte as it has been since the mirror was first
 * generated, so a rebuild diffs as the bundle and the stylesheet and nothing else.
 */
const HEAD = readFileSync(join(root, "scripts/mirror-shell.html"), "utf8").trimEnd();

try {
  // --- The client entry. The mirror has no Next.js runtime, so it mounts Page itself.
  //     Fed through stdin with resolveDir at the repo root so node_modules resolves.
  const entry = [
    'import { createRoot } from "react-dom/client";',
    'import Page from "@/app/page";',
    'const el = document.getElementById("root");',
    "createRoot(el).render(<Page />);",
    "",
  ].join("\n");

  const bundled = await build({
    stdin: { contents: entry, resolveDir: root, sourcefile: "mirror-entry.jsx", loader: "jsx" },
    bundle: true,
    write: false,
    minify: true,
    format: "iife",
    target: "es2022",
    jsx: "automatic",
    legalComments: "eof",
    define: { "process.env.NODE_ENV": '"production"' },
    alias: { "@": join(root, "src") },
    loader: { ".ts": "ts", ".tsx": "tsx" },
  });
  const js = bundled.outputFiles[0].text.trimEnd();

  // --- Tailwind. v4 scans the sources it finds from the stylesheet's own location.
  const cssOut = join(tmp, "mirror.css");
  execFileSync(
    "npx",
    ["@tailwindcss/cli", "-i", join(root, "src/app/globals.css"), "-o", cssOut, "--minify"],
    { cwd: root, stdio: ["ignore", "ignore", "inherit"] },
  );
  const css = readFileSync(cssOut, "utf8").trimEnd();

  const html = `${HEAD}
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}
</script>
</body>
</html>
`;
  writeFileSync(join(root, "docs/index.html"), html);
  console.log(`docs/index.html written, ${(html.length / 1024).toFixed(1)} KB`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
