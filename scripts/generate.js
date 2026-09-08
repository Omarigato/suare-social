// Generates all Instagram & Threads feature, announcement, pricing, and how-it-works slide HTML files.
// Run: node scripts/generate.js

const fs = require("fs");
const path = require("path");
const { buildSlide } = require("./layout");
const {
  announcementPost,
  featuresCarousel,
  comparisonPost,
  howItWorksCarousel,
} = require("./data/posts-content");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

function write(relPath, html) {
  const full = path.join(SRC, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  console.log("wrote", path.relative(ROOT, full));
}

console.log("--- Generating Instagram & Threads HTML slides ---");

/* ==========================================================================
   1. ANNOUNCEMENT POST (01-announcement.html)
   ========================================================================== */
const announcementHtml = buildSlide({
  depth: 3, // src/instagram/post/01-announcement.html -> ../../../shared
  title: "SUARE — Запуск онлайн-пригласительных",
  kicker: announcementPost.kicker,
  headlineLines: announcementPost.headlineLines,
  headlineSize: announcementPost.headlineSize,
  body: announcementPost.body,
  chips: announcementPost.chips,
  footerRight: announcementPost.footerRight,
  photo: announcementPost.photo,
});

write("instagram/post/01-announcement.html", announcementHtml);
write("threads/post/01-announcement.html", announcementHtml.replace(/instagram\/post/g, "threads/post"));

/* ==========================================================================
   2. FEATURES CAROUSEL (02-features/, 8 slides)
   ========================================================================== */
const featureFileNames = [
  "00-cover.html",
  "01-rsvp.html",
  "02-whatsapp.html",
  "03-2gis.html",
  "04-music.html",
  "05-kaspi.html",
  "06-excel.html",
  "07-cta.html",
];

featuresCarousel.forEach((slide, idx) => {
  const html = buildSlide({
    depth: 4, // src/instagram/post/02-features/*.html -> ../../../../shared
    title: `SUARE — ${slide.kicker}`,
    index: idx + 1,
    total: featuresCarousel.length,
    kicker: slide.kicker,
    headlineLines: slide.headlineLines,
    headlineSize: slide.headlineSize,
    body: slide.body,
    icon: slide.icon,
    chips: slide.chips,
    footerRight: slide.footerRight,
    photo: slide.photo,
  });

  const fileName = featureFileNames[idx] || `slide-${idx}.html`;
  write(`instagram/post/02-features/${fileName}`, html);
  write(`threads/post/02-features/${fileName}`, html.replace(/instagram\/post/g, "threads/post"));
});

/* ==========================================================================
   3. PRICING & COMPARISON POST (03-pricing.html)
   ========================================================================== */
const pricingHtml = buildSlide({
  depth: 3,
  title: "SUARE — Бумага против Онлайн",
  kicker: comparisonPost.kicker,
  headlineLines: comparisonPost.headlineLines,
  headlineSize: comparisonPost.headlineSize,
  body: comparisonPost.body,
  compare: comparisonPost.compare,
  footerRight: comparisonPost.footerRight,
});

write("instagram/post/03-pricing.html", pricingHtml);
write("threads/post/03-pricing.html", pricingHtml.replace(/instagram\/post/g, "threads/post"));

/* ==========================================================================
   4. HOW IT WORKS CAROUSEL (04-how-it-works/, 5 slides)
   ========================================================================== */
const howItWorksFiles = [
  "00-cover.html",
  "01-choose-template.html",
  "02-fill-details.html",
  "03-send-whatsapp.html",
  "04-track-rsvp.html",
];

howItWorksCarousel.forEach((slide, idx) => {
  const html = buildSlide({
    depth: 4,
    title: `SUARE — ${slide.kicker}`,
    index: idx + 1,
    total: howItWorksCarousel.length,
    kicker: slide.kicker,
    headlineLines: slide.headlineLines,
    headlineSize: slide.headlineSize,
    body: slide.body,
    icon: slide.icon,
    chips: slide.chips,
    footerRight: slide.footerRight,
    photo: slide.photo,
  });

  const fileName = howItWorksFiles[idx] || `step-${idx}.html`;
  write(`instagram/post/04-how-it-works/${fileName}`, html);
  write(`threads/post/04-how-it-works/${fileName}`, html.replace(/instagram\/post/g, "threads/post"));
});

console.log("Done generating Instagram and Threads HTML templates!\n");
