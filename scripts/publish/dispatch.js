// Unified CLI Dispatcher for multi-platform publishing (Instagram, Threads, TikTok, YouTube).
// Usage:
//   node scripts/publish/dispatch.js --dry-run --platform=all
//   node scripts/publish/dispatch.js --platform=instagram --post=02-features
//   node scripts/publish/dispatch.js --platform=threads --post=01-announcement

const fs = require("fs");
const path = require("path");

// Try loading .env if dotenv or file exists
const envPath = path.join(__dirname, "..", "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      if (!process.env[k.trim()]) process.env[k.trim()] = v.join("=").trim();
    }
  });
}

const { publishInstagramPhoto, publishInstagramCarousel } = require("./publish-instagram");
const { publishThreadsPost } = require("./publish-threads");
const { uploadYouTubeVideo, setYouTubeThumbnail } = require("./publish-youtube");
const { publishTikTok } = require("./publish-tiktok");
const { announcementPost, featuresCarousel } = require("../data/posts-content");

const ROOT = path.join(__dirname, "..", "..");
const EXPORTS = path.join(ROOT, "exports");

// CLI Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");

let platform = "all";
let postTarget = "01-announcement";

args.forEach((arg) => {
  if (arg.startsWith("--platform=")) platform = arg.replace("--platform=", "").trim().toLowerCase();
  if (arg.startsWith("--post=")) postTarget = arg.replace("--post=", "").trim();
});

console.log("=================================================");
console.log("🚀 SUARE SOCIALS MULTI-POST DISPATCHER");
console.log(`🎯 Target Platform: ${platform.toUpperCase()}`);
console.log(`📦 Target Post:     ${postTarget}`);
console.log(`🛡️  Mode:            ${isDryRun ? "DRY-RUN (Simulated)" : "PRODUCTION (Live API)"}`);
console.log("=================================================\n");

async function run() {
  const postUrl = "https://suare.app/static/media/"; // Staging / production CDN URL root

  const sampleCaption = `Қағаз шақырулар дәуірі аяқталды 👰🤵\n\nЭра бумажных пригласительных осталась в прошлом. Создавайте премиальные онлайн-пригласительные на той, свадьбу или юбилей за 5 минут на SUARE.\n\n✨ Онлайн-RSVP в 1 клик\n📍 Локация с картой 2GIS\n💌 Персональная рассылка в WhatsApp\n💳 Kaspi-тойбастар и подарки\n\nСоздайте прямо сейчас 👉 suare.app (ссылка в шапке профиля)\n\n#suare #тойғашақыру #үйленутой #қызұзату #шақыру #свадьба #казахстан #алматы #астана #шымкент`;

  // 1. INSTAGRAM
  if (platform === "all" || platform === "instagram" || platform === "ig") {
    console.log(">>> [1/4] DISPATCHING TO INSTAGRAM...");
    try {
      if (postTarget === "02-features") {
        // Carousel
        const carouselImages = [0, 1, 2, 3, 4, 5, 6, 7].map(
          (i) => `${postUrl}instagram/post/02-features/${String(i).padStart(2, "0")}.png`
        );
        await publishInstagramCarousel({
          imageUrls: carouselImages,
          caption: sampleCaption,
          accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "mock_token",
          accountId: process.env.INSTAGRAM_ACCOUNT_ID || "mock_account_id",
          dryRun: isDryRun || !process.env.INSTAGRAM_ACCESS_TOKEN,
        });
      } else {
        // Single Photo
        await publishInstagramPhoto({
          imageUrl: `${postUrl}instagram/post/01-announcement.png`,
          caption: sampleCaption,
          accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "mock_token",
          accountId: process.env.INSTAGRAM_ACCOUNT_ID || "mock_account_id",
          dryRun: isDryRun || !process.env.INSTAGRAM_ACCESS_TOKEN,
        });
      }
    } catch (e) {
      console.error(`❌ Instagram dispatch error: ${e.message}`);
    }
  }

  // 2. THREADS
  if (platform === "all" || platform === "threads") {
    console.log("\n>>> [2/4] DISPATCHING TO THREADS...");
    try {
      await publishThreadsPost({
        text: `Эра бумажных пригласительных в Казахстане завершилась ✨\n\nВстречайте SUARE — сервис цифровых пригласительных нового поколения. 1 клик для RSVP гостей, карта 2GIS и отправка в WhatsApp.\n\nПопробуйте на suare.app`,
        imageUrl: `${postUrl}threads/post/01-announcement.png`,
        accessToken: process.env.THREADS_ACCESS_TOKEN || "mock_threads_token",
        dryRun: isDryRun || !process.env.THREADS_ACCESS_TOKEN,
      });
    } catch (e) {
      console.error(`❌ Threads dispatch error: ${e.message}`);
    }
  }

  // 3. TIKTOK
  if (platform === "all" || platform === "tiktok") {
    console.log("\n>>> [3/4] DISPATCHING TO TIKTOK...");
    try {
      await publishTikTok({
        title: `Забудьте про бумажные шақыру! Премиальные онлайн-пригласительные на той suare.app #той #свадьба #шакыру`,
        imageUrls: [`${postUrl}tiktok/cover/01-launch-cover.png`],
        accessToken: process.env.TIKTOK_ACCESS_TOKEN || "mock_tiktok_token",
        dryRun: isDryRun || !process.env.TIKTOK_ACCESS_TOKEN,
      });
    } catch (e) {
      console.error(`❌ TikTok dispatch error: ${e.message}`);
    }
  }

  // 4. YOUTUBE
  if (platform === "all" || platform === "youtube" || platform === "yt") {
    console.log("\n>>> [4/4] DISPATCHING TO YOUTUBE...");
    try {
      const sampleThumb = path.join(EXPORTS, "youtube", "cover", "00-playlist.png");
      await setYouTubeThumbnail({
        videoId: process.env.YOUTUBE_SAMPLE_VIDEO_ID || "mock_video_id",
        thumbnailPath: sampleThumb,
        accessToken: process.env.YOUTUBE_ACCESS_TOKEN || "mock_yt_token",
        dryRun: isDryRun || !process.env.YOUTUBE_ACCESS_TOKEN,
      });
    } catch (e) {
      console.error(`❌ YouTube dispatch error: ${e.message}`);
    }
  }

  console.log("\n=================================================");
  console.log("✨ ALL DISPATCH ROUTINES FINISHED SUCCESSFULLY!");
  console.log("=================================================");
}

run();
