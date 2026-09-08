// Zero-dependency headless browser renderer for SUARE social media assets.
// Uses local Google Chrome or Microsoft Edge directly via CLI flags.
//
// Usage:
//   node scripts/capture.js               -> render everything in src/
//   node scripts/capture.js "" instagram  -> render only src/instagram/**
//   node scripts/capture.js "" youtube    -> render only src/youtube/**
//   node scripts/capture.js "" tiktok     -> render only src/tiktok/**

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");
const EXPORTS = path.join(ROOT, "exports");

// Locate browser executable
function findBrowser() {
  if (process.platform === "win32") {
    const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
    const chromeX86 = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
    const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
    const edge64 = "C:/Program Files/Microsoft/Edge/Application/msedge.exe";

    if (fs.existsSync(chrome)) return chrome;
    if (fs.existsSync(edge)) return edge;
    if (fs.existsSync(chromeX86)) return chromeX86;
    if (fs.existsSync(edge64)) return edge64;
  }
  return "google-chrome";
}

let BROWSER = findBrowser();
let FILTER = "";

// Parse flags like --filter=... or --browser=... or positional args
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--filter=")) {
    FILTER = arg.replace("--filter=", "").trim();
  } else if (arg.startsWith("--browser=")) {
    BROWSER = arg.replace("--browser=", "").trim();
  } else if (arg.endsWith(".exe") || arg.includes("/") || arg.includes("\\")) {
    BROWSER = arg.trim();
  } else if (arg.trim()) {
    FILTER = arg.trim();
  }
}

console.log(`Using Browser: ${BROWSER}`);
if (FILTER) console.log(`Applying Filter: "${FILTER}"`);

function sizeFor(relDir) {
  const norm = relDir.replace(/\\/g, "/");
  if (norm.startsWith("instagram/post") || norm.startsWith("threads/post")) {
    return [1080, 1350]; // 4:5 Feed
  }
  if (norm.startsWith("instagram/story") || norm.startsWith("tiktok/cover")) {
    return [1080, 1920]; // 9:16 Fullscreen Vertical
  }
  if (norm.startsWith("youtube/cover")) {
    return [1920, 1080]; // 16:9 Landscape Video
  }
  return [1080, 1350];
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walk(SRC)
  .filter((f) => !f.includes(path.join("src", "shared")))
  .filter((f) => !FILTER || path.relative(SRC, f).replace(/\\/g, "/").includes(FILTER));

if (htmlFiles.length === 0) {
  console.log("No HTML files found matching filter. Run 'npm run generate' first!");
  process.exit(0);
}

console.log(`Found ${htmlFiles.length} files to render...\n`);

let rendered = 0;
for (const file of htmlFiles) {
  const relFromSrc = path.relative(SRC, file);
  const relDir = path.dirname(relFromSrc);
  const [w, h] = sizeFor(relDir);
  const outPath = path.join(EXPORTS, relDir, path.basename(file, ".html") + ".png");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const fileUrl = "file:///" + file.replace(/\\/g, "/");
  try {
    execFileSync(
      BROWSER,
      [
        "--headless=new",
        "--disable-gpu",
        `--screenshot=${outPath}`,
        `--window-size=${w},${h}`,
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--virtual-time-budget=6000",
        fileUrl,
      ],
      { stdio: "pipe" }
    );
    console.log(`[RENDERED] ${w}x${h} -> ${path.relative(ROOT, outPath)}`);
    rendered++;
  } catch (err) {
    // Fallback without --headless=new for older Chrome/Edge
    try {
      execFileSync(
        BROWSER,
        [
          "--headless",
          "--disable-gpu",
          `--screenshot=${outPath}`,
          `--window-size=${w},${h}`,
          "--hide-scrollbars",
          "--force-device-scale-factor=1",
          "--virtual-time-budget=6000",
          fileUrl,
        ],
        { stdio: "pipe" }
      );
      console.log(`[RENDERED-LEGACY] ${w}x${h} -> ${path.relative(ROOT, outPath)}`);
      rendered++;
    } catch (err2) {
      console.error(`[FAIL] ${relFromSrc}: ${err2.message}`);
    }
  }
}

console.log(`\nRendering complete: ${rendered}/${htmlFiles.length} files saved to exports/`);
