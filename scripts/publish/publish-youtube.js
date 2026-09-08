// YouTube Publishing & Thumbnail Engine for SUARE.
// Uses YouTube Data API v3 for uploading Shorts/videos and setting custom thumbnails.

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
            reject(new Error(`YouTube API Error [${res.statusCode}]: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * Set custom thumbnail for an existing YouTube video
 */
async function setYouTubeThumbnail({ videoId, thumbnailPath, accessToken, dryRun = false }) {
  console.log(`[YouTube] Setting custom thumbnail for video ${videoId}...`);
  if (dryRun) {
    console.log(`[DRY RUN] Would set thumbnail ${thumbnailPath} on video ${videoId}`);
    return { success: true, dryRun: true };
  }

  if (!fs.existsSync(thumbnailPath)) {
    throw new Error(`Thumbnail file not found: ${thumbnailPath}`);
  }

  const imageBuffer = fs.readFileSync(thumbnailPath);
  const uploadUrl = `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`;

  const res = await httpRequest(
    uploadUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length,
      },
    },
    imageBuffer
  );

  console.log(`[YouTube] Thumbnail set successfully!`);
  return { success: true, response: res };
}

/**
 * Upload Video / Short to YouTube
 */
async function uploadYouTubeVideo({
  videoPath,
  title,
  description,
  tags = ["suare", "свадьба", "тойға шақыру", "онлайн-шақыру"],
  privacyStatus = "public",
  accessToken,
  dryRun = false,
}) {
  console.log(`[YouTube] Preparing video upload: "${title}"...`);
  if (dryRun) {
    console.log(`[DRY RUN] Would upload video to YouTube:`);
    console.log(`  File: ${videoPath}`);
    console.log(`  Title: ${title}`);
    console.log(`  Privacy: ${privacyStatus}`);
    return { success: true, dryRun: true, id: "dry_run_yt_video_id" };
  }

  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  const metadata = {
    snippet: {
      title,
      description,
      tags,
      categoryId: "22", // People & Blogs
    },
    status: {
      privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  };

  const videoBuffer = fs.readFileSync(videoPath);
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody = Buffer.concat([
    Buffer.from(
      delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: video/mp4\r\n\r\n'
    ),
    videoBuffer,
    Buffer.from(closeDelimiter),
  ]);

  const uploadUrl =
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status";

  const res = await httpRequest(
    uploadUrl,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": multipartBody.length,
      },
    },
    multipartBody
  );

  console.log(`[YouTube] Video uploaded successfully! Video ID: ${res.id}`);
  return { success: true, id: res.id, url: `https://youtu.be/${res.id}` };
}

module.exports = {
  setYouTubeThumbnail,
  uploadYouTubeVideo,
};
