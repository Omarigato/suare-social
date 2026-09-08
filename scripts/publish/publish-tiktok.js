// TikTok Content Posting Engine for SUARE.
// Uses official TikTok Content Posting API with support for video, slideshow, and dry-run.

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
            reject(new Error(`TikTok API Error [${res.statusCode}]: ${JSON.stringify(parsed)}`));
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
 * Publish Video or Photo Carousel to TikTok
 */
async function publishTikTok({ videoUrl = null, imageUrls = [], title, accessToken, dryRun = false }) {
  console.log(`[TikTok] Preparing publication: "${title}"...`);

  if (dryRun) {
    console.log(`[DRY RUN] Would post to TikTok:`);
    console.log(`  Title: ${title}`);
    if (videoUrl) console.log(`  Video: ${videoUrl}`);
    if (imageUrls.length) console.log(`  Slideshow (${imageUrls.length} photos): ${imageUrls.join(", ")}`);
    return { success: true, dryRun: true, publish_id: "dry_run_tiktok_id" };
  }

  let payload = {};
  let endpoint = "";

  if (videoUrl) {
    endpoint = "https://open.tiktokapis.com/v2/post/publish/video/init/";
    payload = {
      post_info: {
        title,
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_duet: false,
        disable_stitch: false,
        disable_comment: false,
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl,
      },
    };
  } else if (imageUrls && imageUrls.length > 0) {
    endpoint = "https://open.tiktokapis.com/v2/post/publish/content/init/";
    payload = {
      post_info: {
        title,
        privacy_level: "PUBLIC_TO_EVERYONE",
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_images: imageUrls,
      },
      post_mode: "DIRECT_POST",
      media_type: "PHOTO",
    };
  } else {
    throw new Error("Either videoUrl or imageUrls must be provided for TikTok publication");
  }

  const res = await httpRequest(
    endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
    },
    payload
  );

  console.log(`[TikTok] Post initialized successfully! Publish ID: ${res.data ? res.data.publish_id : JSON.stringify(res)}`);
  return { success: true, data: res.data };
}

module.exports = {
  publishTikTok,
};
