// Generates 9:16 vertical covers for TikTok and Instagram Stories (1080x1920).
// Run: node scripts/generate-tiktok.js

const fs = require("fs");
const path = require("path");
const { buildStory } = require("./layout");
const icons = require("./icons");
const { nextPhoto } = require("./data/posts-content");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

function write(relPath, html) {
  const full = path.join(SRC, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log("wrote", path.relative(ROOT, full));
}

console.log("--- Generating TikTok & Stories 9:16 HTML covers ---");

// 1. TikTok Launch Cover
write(
  "tiktok/cover/01-launch-cover.html",
  buildStory({
    depth: 3,
    title: "SUARE — TikTok Launch",
    kicker: "НОВАЯ ЭРА ТОЕВ В КАЗАХСТАНЕ",
    headlineLines: [
      { text: "ЗАБУДЬТЕ", mode: "solid" },
      { text: "ПРО БУМАЖНЫЕ", mode: "stroke" },
      { text: "ШАҚЫРУ.", mode: "accent" },
    ],
    headlineSize: 88,
    body: "Как сделать стильное пригласительное на свадьбу или қыз ұзату за 5 минут прямо со смартфона.",
    icon: icons.sparkles,
    chips: ["СВАДЬБА", "ҚЫЗ ҰЗАТУ", "RSVP В 1 КЛИК"],
    photo: nextPhoto(),
  })
);

// 2. TikTok Paper vs Online
write(
  "tiktok/cover/02-paper-vs-suare.html",
  buildStory({
    depth: 3,
    title: "SUARE — Бумага против Онлайн",
    kicker: "ЭКОНОМИЯ НА СВАДЬБЕ",
    headlineLines: [
      { text: "ПОЧЕМУ ТЫ", mode: "solid" },
      { text: "ТЕРЯЕШЬ ДЕНЬГИ", mode: "stroke" },
      { text: "НА БУМАГЕ?", mode: "accent" },
    ],
    headlineSize: 84,
    body: "Посчитай: пустые места в банкетном зале стоят дороже свадьбы. Как собрать точный список гостей.",
    icon: icons.barChart3,
    chips: ["ЛАЙФХАК ДЛЯ ТОЯ", "ТОЧНЫЙ СПИСОК"],
    photo: nextPhoto(),
  })
);

// 3. Instagram Story: RSVP Demo
write(
  "instagram/story/01-rsvp-demo.html",
  buildStory({
    depth: 3,
    title: "SUARE — Онлайн RSVP",
    kicker: "ФУНКЦИИ SUARE",
    headlineLines: [
      { text: "ГОСТИ САМИ", mode: "solid" },
      { text: "ПОДТВЕРЖДАЮТ", mode: "stroke" },
      { text: "ПРИСУТСТВИЕ.", mode: "accent" },
    ],
    headlineSize: 84,
    body: "Больше никаких бесконечных звонков родственникам: видно, кто придёт и с кем.",
    icon: icons.checkCircle,
    chips: ["RSVP В 1 КЛИК", "SUARE.APP"],
    photo: nextPhoto(),
  })
);

// 4. Instagram Story: WhatsApp Invite
write(
  "instagram/story/02-whatsapp-demo.html",
  buildStory({
    depth: 3,
    title: "SUARE — WhatsApp рассылка",
    kicker: "УДОБНО ДЛЯ РОДНЫХ",
    headlineLines: [
      { text: "РАССЫЛКА В", mode: "solid" },
      { text: "WHATSAPP", mode: "stroke" },
      { text: "ПО ИМЕНАМ.", mode: "accent" },
    ],
    headlineSize: 84,
    body: "Каждый гость получает персональную ссылку с красивым превью в чат.",
    icon: icons.whatsapp,
    chips: ["WHATSAPP", "ИМЕННЫЕ ШАҚЫРУ"],
    photo: nextPhoto(),
  })
);

console.log("Done generating TikTok & Stories covers!\n");
