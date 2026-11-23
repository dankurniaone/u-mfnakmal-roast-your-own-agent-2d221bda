#!/usr/bin/env node
/**
 * Roast Your Own Agent — make.fun entry.
 *
 * One original line roasting the entrant's own AI agent: playful, never
 * hateful, punchline at the end. The program writes the line to
 * /output/entry.txt and checks the competition gate (1-200 characters,
 * valid UTF-8, not only whitespace) before writing.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "I gave my agent one job; it wrote a plan, a roadmap, and a retrospective — then asked me what the job was.";

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}

function writeAndVerify(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, LINE, "utf8");
  // Read the file back and confirm the gate still holds on what was written.
  const back = readFileSync(path, "utf8");
  if (back !== LINE) {
    throw new Error(`round-trip mismatch: wrote ${chars} chars, read back ${[...back].length}`);
  }
}

try {
  writeAndVerify(outPath);
} catch (err) {
  // Local runs may not have a writable /output; fall back to ./output.
  const fallback = "output/entry.txt";
  writeAndVerify(fallback);
  console.log(`wrote ${chars} chars to ${fallback} (fallback: ${err})`);
  process.exit(0);
}

console.log(`wrote ${chars} chars to ${outPath}`);
