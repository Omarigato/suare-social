// Generates all 20 YouTube video tutorial cover / thumbnail HTML files (1920x1080).
// Run: node scripts/generate-youtube.js

const fs = require("fs");
const path = require("path");
const { buildCover } = require("./layout");
const icons = require("./icons");
const { youtubeLessons, nextPhoto } = require("./data/posts-content");

const ROOT = path.join(__dirname, "..");
const YT_DIR = path.join(ROOT, "src", "youtube", "cover");

function write(relPath, html) {
  const full = path.join(YT_DIR, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log("wrote", path.relative(ROOT, full));
}

console.log("--- Generating YouTube 16:9 Thumbnail HTML files ---");

// Helper to slugify filenames
function slugify(text) {
  const ruMap = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
    " ": "-", ":": "", "?": "", ",": "", ".": "", "/": "-",
  };
  return text
    .toLowerCase()
    .split("")
    .map((char) => (ruMap[char] !== undefined ? ruMap[char] : char))
    .join("")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// 00 - Course Playlist Cover
write(
  "00-playlist.html",
  buildCover({
    depth: 3,
    title: "SUARE — Обучающий курс по онлайн-шақыру",
    lesson: null,
    total: 20,
    kicker: "ОБУЧАЮЩИЙ КУРС ПО SUARE",
    headlineLines: [
      { text: "ПОЛНЫЙ КУРС.", mode: "solid" },
      { text: "ОНЛАЙН-ШАҚЫРУ", mode: "stroke" },
      { text: "ОТ А ДО Я.", mode: "accent" },
    ],
    headlineSize: 84,
    sub: "20 пошаговых видеоуроков: от создания первого пригласительного до идеального списка гостей и экономии бюджета тоя.",
    icon: icons.sparkles,
    chips: ["20 УРОКОВ", "SUARE.APP", "БЕСПЛАТНО"],
    photo: nextPhoto(),
  })
);

// 01 to 20 - Lesson Covers
youtubeLessons.forEach((lesson) => {
  const numStr = String(lesson.num).padStart(2, "0");
  const slug = slugify(lesson.title.slice(0, 30));
  const filename = `${numStr}-${slug}.html`;

  const html = buildCover({
    depth: 3,
    title: `SUARE — Урок ${numStr}: ${lesson.title}`,
    lesson: lesson.num,
    total: 20,
    kicker: `УРОК ${numStr} / 20`,
    headlineLines: lesson.headline,
    headlineSize: 80,
    sub: lesson.sub,
    icon: lesson.icon,
    chips: lesson.chips,
    photo: nextPhoto(),
  });

  write(filename, html);
});

console.log("Done generating YouTube covers!\n");
