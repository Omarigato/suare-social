// Instagram Publishing Engine for SUARE (Single Post, Carousel, Reels).
// Uses Meta Graph API endpoints with support for local staging, fallback, and dry-run.

const fs = require("fs");
const path = require("path");
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
            reject(new Error(`API Error [${res.statusCode}]: ${JSON.stringify(parsed)}`));
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
 * Publish Single Photo to Instagram
 */
async function publishInstagramPhoto({ imageUrl, caption, accessToken, accountId, dryRun = false }) {
  console.log(`[Instagram] Preparing single photo upload...`);
  if (dryRun) {
    console.log(`[DRY RUN] Would post photo to account ${accountId}:`);
    console.log(`  Image: ${imageUrl}`);
    console.log(`  Caption: ${caption.slice(0, 100)}...`);
    return { success: true, dryRun: true, id: "dry_run_ig_photo_id" };
  }

  // Step 1: Create media container
  const containerUrl = `https://graph.facebook.com/v19.0/${accountId}/media?image_url=${encodeURIComponent(
    imageUrl
  )}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`;
  const container = await httpRequest(containerUrl, { method: "POST" });
  console.log(`[Instagram] Media container created: ${container.id}`);

  // Step 2: Publish container
  const publishUrl = `https://graph.facebook.com/v19.0/${accountId}/media_publish?creation_id=${container.id}&access_token=${accessToken}`;
  const published = await httpRequest(publishUrl, { method: "POST" });
  console.log(`[Instagram] Successfully published! Post ID: ${published.id}`);
  return { success: true, id: published.id };
}

/**
 * Publish Multi-Slide Carousel to Instagram
 */
async function publishInstagramCarousel({ imageUrls, caption, accessToken, accountId, dryRun = false }) {
  console.log(`[Instagram] Preparing carousel with ${imageUrls.length} slides...`);
  if (dryRun) {
    console.log(`[DRY RUN] Would post carousel to account ${accountId} with ${imageUrls.length} slides:`);
    imageUrls.forEach((u, i) => console.log(`  Slide ${i + 1}: ${u}`));
    console.log(`  Caption: ${caption.slice(0, 100)}...`);
    return { success: true, dryRun: true, id: "dry_run_ig_carousel_id" };
  }

  // Step 1: Create individual item containers
  const childIds = [];
  for (const [index, imgUrl] of imageUrls.entries()) {
    console.log(`[Instagram] Uploading slide ${index + 1}/${imageUrls.length}...`);
    const itemUrl = `https://graph.facebook.com/v19.0/${accountId}/media?is_carousel_item=true&image_url=${encodeURIComponent(
      imgUrl
    )}&access_token=${accessToken}`;
    const item = await httpRequest(itemUrl, { method: "POST" });
    childIds.push(item.id);
  }

  // Step 2: Create Carousel parent container
  console.log(`[Instagram] Combining ${childIds.length} slides into carousel...`);
  const carouselUrl = `https://graph.facebook.com/v19.0/${accountId}/media?media_type=CAROUSEL&children=${childIds.join(
    ","
  )}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`;
  const carousel = await httpRequest(carouselUrl, { method: "POST" });

  // Step 3: Publish Carousel
  const publishUrl = `https://graph.facebook.com/v19.0/${accountId}/media_publish?creation_id=${carousel.id}&access_token=${accessToken}`;
  const published = await httpRequest(publishUrl, { method: "POST" });
  console.log(`[Instagram] Carousel published successfully! Post ID: ${published.id}`);
  return { success: true, id: published.id };
}

module.exports = {
  publishInstagramPhoto,
  publishInstagramCarousel,
};
