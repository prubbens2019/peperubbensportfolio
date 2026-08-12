import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "content");
const publicContentDir = join(__dirname, "..", "public", "content");

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function main() {
  if (!existsSync(contentDir)) return;

  rmSync(publicContentDir, { recursive: true, force: true });
  mkdirSync(publicContentDir, { recursive: true });

  cpSync(contentDir, publicContentDir, {
    recursive: true,
    filter: (src) => {
      const stat = statSync(src);
      if (stat.isDirectory()) return true;
      return imageExtensions.has(extname(src).toLowerCase());
    },
  });

  console.log("Synced content images to /public/content");
}

main();
