// Mieszkanie room and cat cards, based on Living House Card v0.4.0.
// Usage: node build.mjs  ->  dist/mieszkanie-rooms-card.js
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), "utf8");
const css = (p) => "`" + read(p).replace(/\\/g, "\\\\").replace(/`/g, "\\`").trim() + "\n`";
const body = [
  read("src/shared.js").replace("__VERSION__", "0.4.0"),
  read("src/rooms-card.js").replace("__ROOMS_CSS__", css("src/rooms.css")),
  read("src/cats-card.js").replace("__CATS_CSS__", css("src/cats.css")),
].join("\n\n");
const out = `/* mieszkanie-rooms-card + mieszkanie-cats-card – based on Living House Card v0.4.0 (MIT) */\n(() => {\n"use strict";\n${body}\n})();\n`;
writeFileSync(join(root, "dist", "mieszkanie-rooms-card.js"), out);
console.log(`dist/mieszkanie-rooms-card.js  ${(out.length / 1024).toFixed(1)} KB`);
