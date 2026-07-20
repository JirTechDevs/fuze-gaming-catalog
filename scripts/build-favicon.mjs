// One-off: build a proper multi-size favicon.ico from public/images/logo.png.
// Run: bun run scripts/build-favicon.mjs

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";

const SOURCE = "public/images/logo.png";
const OUT = "public/favicon.ico";
const SIZES = [16, 32, 48, 64];

const buffers = await Promise.all(
  SIZES.map((size) =>
    sharp(SOURCE)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
  ),
);

const ico = await pngToIco(buffers);
await writeFile(OUT, ico);

console.log(`Wrote ${OUT} — sizes: ${SIZES.join(", ")} (${ico.length} bytes)`);
