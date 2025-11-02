/**
 * Script to create optimized avatar image variants
 * Generates 88px, 176px (2x), and 320px (retina) versions
 *
 * Usage: node scripts/optimize-avatar.js
 * Requires: sharp package (npm install sharp --save-dev)
 */

import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, "..", "public");
const sourceImage = join(publicDir, "ProfilePic.jpg");

// Check if source exists
if (!existsSync(sourceImage)) {
  console.error(`❌ Source image not found: ${sourceImage}`);
  process.exit(1);
}

const variants = [
  { size: 88, suffix: "-88", quality: 95 }, // Mobile 1x
  { size: 176, suffix: "-176", quality: 90 }, // Mobile 2x / Desktop 1x (approx)
  { size: 320, suffix: "-320", quality: 85 }, // Desktop 2x / Retina
];

async function optimizeAvatar() {
  console.log("🖼️  Optimizing avatar images...\n");

  for (const variant of variants) {
    const outputPath = join(publicDir, `ProfilePic${variant.suffix}.jpg`);

    try {
      await sharp(sourceImage)
        .resize(variant.size, variant.size, {
          fit: "cover",
          position: "center",
          kernel: "lanczos3", // Best quality downscaling
        })
        .jpeg({
          quality: variant.quality,
          progressive: true,
          mozjpeg: true, // Better compression if available
        })
        .toFile(outputPath);

      console.log(
        `✅ Created ${variant.size}x${variant.size} → ProfilePic${variant.suffix}.jpg`
      );
    } catch (error) {
      console.error(
        `❌ Failed to create ${variant.size}px variant:`,
        error.message
      );
    }
  }

  console.log("\n✨ Avatar optimization complete!");
}

optimizeAvatar().catch((error) => {
  console.error("❌ Optimization failed:", error);
  process.exit(1);
});
