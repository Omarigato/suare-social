// Pushes generated Suare post bundle to local n8n instance (webhook).
// Connects with user's active n8n instance running on localhost:5678.

const fs = require("fs");
const path = require("path");
const http = require("http");

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/suare-social-post";

const ROOT = path.join(__dirname, "..", "..");
const EXPORTS = path.join(ROOT, "exports");

async function pushToN8n(postType = "01-announcement") {
  console.log(`[n8n Bridge] Preparing bundle for "${postType}"...`);

  const payload = {
    event: "SUARE_SOCIAL_PUBLISH",
    timestamp: new Date().toISOString(),
    post_id: postType,
    platforms: ["instagram", "threads", "tiktok", "youtube"],
    brand: "SUARE",
    website: "https://suare.app",
    content: {
      title_kz: "Қағаз шақырулар дәуірі аяқталды 👰🤵",
      caption_kz: `Қағаз шақырулар дәуірі аяқталды 👰🤵\n\nЭра бумажных пригласительных осталась в прошлом. Создавайте премиальные онлайн-пригласительные на той, свадьбу или юбилей за 5 минут на SUARE.\n\n✨ Онлайн-RSVP в 1 клик\n📍 Локация с картой 2GIS\n💌 Персональная рассылка в WhatsApp\n💳 Kaspi-тойбастар и подарки\n\nСілтеме профильде 👉 suare.app`,
      hashtags: "#suare #тойғашақыру #үйленутой #қызұзату #шақыру #свадьба #казахстан #алматы #астана",
    },
    files: {
      instagram_post: path.join(EXPORTS, "instagram", "post", `${postType}.png`),
      threads_post: path.join(EXPORTS, "threads", "post", `${postType}.png`),
      youtube_cover: path.join(EXPORTS, "youtube", "cover", "00-playlist.png"),
      tiktok_cover: path.join(EXPORTS, "tiktok", "cover", "01-launch-cover.png"),
    },
  };

  const dataString = JSON.stringify(payload, null, 2);
  console.log(`[n8n Bridge] Sending payload to ${N8N_WEBHOOK_URL}...`);

  const url = new URL(N8N_WEBHOOK_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || 5678,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(dataString),
    },
  };

  const req = http.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      console.log(`[n8n Bridge] Response status: ${res.statusCode}`);
      console.log(`[n8n Bridge] Response body: ${body}`);
      console.log(`✅ Suare post successfully transmitted to n8n!`);
    });
  });

  req.on("error", (e) => {
    console.warn(`⚠️ Could not reach n8n at ${N8N_WEBHOOK_URL} (${e.message}).`);
    console.log(`ℹ️ Tip: Make sure your webhook node in n8n is active with path "suare-social-post".`);
    console.log(`Payload prepared:`, payload);
  });

  req.write(dataString);
  req.end();
}

const target = process.argv[2] || "01-announcement";
pushToN8n(target);
