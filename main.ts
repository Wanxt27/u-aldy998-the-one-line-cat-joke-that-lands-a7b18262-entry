import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke: a cat knocks a glass off the table, watches it smash, and
// then blames the owner with a look. Setup (the push), turn (the stare
// and the silent accusation). No tired cat pun, nothing to explain.
const JOKE =
  "My cat pushed my glass off the table, watched it shatter, then looked at me like I should apologize.";

const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function checkJoke(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  checkJoke(JOKE);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JOKE, "utf8");
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== JOKE) {
    throw new Error("entry.txt does not match the joke");
  }
  // Byte-level check as well, so no trailing newline or encoding
  // surprise can slip through unnoticed.
  if (!Buffer.from(written, "utf8").equals(Buffer.from(JOKE, "utf8"))) {
    throw new Error("entry.txt bytes do not match the joke");
  }
  console.log(`${[...written].length} chars: ${written}`);
}

main();
