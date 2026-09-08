// Threads Publishing Engine for SUARE.
// Uses official Meta Threads API endpoints with support for text, images, carousels, and dry-run.

const https = require("https");

function httpRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Threads API Error [${res.statusCode}]: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(typeof data === "string" ? data : JSON.stringify(data));
    req.end();
  });
}

/**
 * Publish Post to Threads
 */
async function publishThreadsPost({ text, imageUrl = null, imageUrls = [], accessToken, dryRun = false }) {
  console.log(`[Threads] Preparing post publication...`);

  if (dryRun) {
    console.log(`[DRY RUN] Would post to Threads:`);
    console.log(`  Text: ${text.slice(0, 120)}...`);
    if (imageUrl) console.log(`  Image: ${imageUrl}`);
    if (imageUrls.length) imageUrls.forEach((u, i) => console.log(`  Slide ${i + 1}: ${u}`));
    return { success: true, dryRun: true, id: "dry_run_threads_id" };
  }

  // Step 1: Create Container
  let createUrl = `https://graph.threads.net/v1.0/me/threads?text=${encodeURIComponent(text)}&access_token=${accessToken}`;

  if (imageUrls && imageUrls.length > 1) {
    // Carousel
    const childIds = [];
    for (const url of imageUrls) {
      const itemUrl = `https://graph.threads.net/v1.0/me/threads?media_type=IMAGE&image_url=${encodeURIComponent(
        url
      )}&is_carousel_item=true&access_token=${accessToken}`;
      const item = await httpRequest(itemUrl, { method: "POST" });
      childIds.push(item.id);
    }
    createUrl = `https://graph.threads.net/v1.0/me/threads?media_type=CAROUSEL&children=${childIds.join(
      ","
    )}&text=${encodeURIComponent(text)}&access_token=${accessToken}`;
  } else if (imageUrl) {
    createUrl = `https://graph.threads.net/v1.0/me/threads?media_type=IMAGE&image_url=${encodeURIComponent(
      imageUrl
    )}&text=${encodeURIComponent(text)}&access_token=${accessToken}`;
  } else {
    createUrl = `https://graph.threads.net/v1.0/me/threads?media_type=TEXT&text=${encodeURIComponent(
      text
    )}&access_token=${accessToken}`;
  }

  const container = await httpRequest(createUrl, { method: "POST" });
  console.log(`[Threads] Media container created: ${container.id}`);

  // Step 2: Publish Container
  const publishUrl = `https://graph.threads.net/v1.0/me/threads_publish?creation_id=${container.id}&access_token=${accessToken}`;
  const published = await httpRequest(publishUrl, { method: "POST" });
  console.log(`[Threads] Successfully published to Threads! ID: ${published.id}`);
  return { success: true, id: published.id };
}

module.exports = {
  publishThreadsPost,
};
