// Standalone HTML layout generator for SUARE social media slides & covers.
// Automatically auto-fits text, formats responsive badges, and generates luxury layouts.

function relShared(depth) {
  return "../".repeat(depth) + "shared";
}

function iconSvg(pathData, size = 68, color = "currentColor") {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
}

function baseHead(depth, title) {
  const shared = relShared(depth);
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=1080, user-scalable=no">
  <link rel="stylesheet" href="${shared}/styles.css">
  <title>${title}</title>`;
}

function headerBar(depth, index = null, total = null) {
  const shared = relShared(depth);
  const indexHtml =
    index !== null && total !== null
      ? `<div class="slide-index"><b>${String(index).padStart(2, "0")}</b> / ${String(total).padStart(2, "0")}</div>`
      : "";

  return `<div class="header-bar">
    <div class="logo-wrap">
      <img src="${shared}/logo-light.svg" alt="SUARE">
    </div>
    ${indexHtml}
  </div>`;
}

function footerBar(rightLine1 = "<b>@suare.app</b> · suare.app", rightLine2 = "Казахстан") {
  return `<div class="footer-bar">
    <div class="handle">${rightLine1}</div>
    <div class="footer-badge">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      <span>${rightLine2}</span>
    </div>
  </div>`;
}

/**
 * Builds 4:5 Instagram & Threads Post Slide (1080x1350)
 */
function buildSlide(opts) {
  const {
    depth = 3,
    title = "SUARE",
    index = null,
    total = null,
    kicker = "",
    headlineLines = [],
    headlineSize = 82,
    body = "",
    icon = null,
    chips = [],
    mockup = null,
    compare = null,
    photo = null,
    footerRight = null,
  } = opts;

  // Auto-fit calculation: prevent text overflow
  const maxChars = Math.max(1, ...headlineLines.map((l) => l.text.length));
  const fitSize = Math.floor(920 / (maxChars * 0.82));
  const effectiveSize = Math.min(headlineSize, fitSize);

  const headlineHtml = headlineLines
    .map((l) => {
      if (l.mode === "stroke") {
        return `<span class="text-stroke" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      if (l.mode === "accent") {
        return `<span class="text-gold" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      if (l.mode === "serif") {
        return `<span class="font-serif text-gold" style="display:block; white-space:nowrap; font-style:italic;">${l.text}</span>`;
      }
      return `<span style="display:block; white-space:nowrap;">${l.text}</span>`;
    })
    .join("\n        ");

  const iconBlock = icon
    ? `<div class="notch-gold" style="width:120px; height:120px; display:flex; align-items:center; justify-content:center; color:hsl(var(--primary)); margin-bottom:38px;">
        ${iconSvg(icon, 62, "hsl(var(--primary))")}
      </div>`
    : "";

  const chipsBlock = chips.length
    ? `<div class="slide-chips">
        ${chips.map((c) => `<span class="slide-chip ${c.gold ? "gold" : ""}">${c.text || c}</span>`).join("\n        ")}
      </div>`
    : "";

  const photoBlock = photo
    ? `<div class="bg-photo"><img src="${photo}" alt=""></div>
       <div class="photo-overlay"></div>`
    : "";

  // Optional Phone Mockup block
  let mockupBlock = "";
  if (mockup) {
    mockupBlock = `
    <div class="mockup-wrap" style="margin-top:20px;">
      <div class="phone-frame">
        <div class="phone-screen">
          <div class="phone-notch"></div>
          <div class="invite-card-preview">
            <div class="tag">${mockup.eventType || "ҮЙЛЕНУ ТОЙ"}</div>
            <h2>${mockup.title || "Тойға шақыру"}</h2>
            <div class="names">${mockup.names || "Алихан & Аружан"}</div>
            <div style="font-family:'JetBrains Mono'; font-size:13px; color:hsl(var(--muted-foreground)); margin:10px 0;">
              ${mockup.date || "18 Шілде 2026 · 18:00"}
            </div>
            <div style="font-family:'Manrope'; font-size:13px; color:#F4F4F2; margin-bottom:16px;">
              ${mockup.venue || "«Ritz-Carlton Almaty», Ball Room"}
            </div>
            <div class="rsvp-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 12 2 2 4-4"/></svg>
              <span>${mockup.btnText || "Иә, келемін (RSVP)"}</span>
            </div>
          </div>
          <div style="margin-top:16px; padding:12px; border-radius:12px; background:hsl(var(--card)); border:1px solid hsl(var(--border)); text-align:center;">
            <div style="font-family:'JetBrains Mono'; font-size:11px; color:hsl(var(--primary));">ҚОНАҚТАР САНЫ:</div>
            <div style="font-family:'JetBrains Mono'; font-size:20px; font-weight:700; color:#F4F4F2; margin-top:4px;">
              ${mockup.rsvpCount || "142 / 160 расталды"}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Optional Comparison Matrix
  let compareBlock = "";
  if (compare) {
    compareBlock = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-top:36px; width:100%;">
      <div class="notch" style="padding:32px; border-color:hsl(0 40% 30% / 0.6); background:hsl(0 30% 10% / 0.5);">
        <div style="font-family:'JetBrains Mono'; font-size:18px; color:hsl(0 60% 60%); font-weight:700; margin-bottom:16px;">
          ${compare.badTitle || "❌ БУМАЖНЫЕ ШАҚЫРУ"}
        </div>
        <ul style="margin:0; padding-left:20px; font-size:22px; color:hsl(var(--muted-foreground)); line-height:1.6;">
          ${compare.badItems.map((i) => `<li style="margin-bottom:12px;">${i}</li>`).join("")}
        </ul>
      </div>
      <div class="notch-gold" style="padding:32px; background:hsl(var(--card));">
        <div style="font-family:'JetBrains Mono'; font-size:18px; color:hsl(var(--primary)); font-weight:700; margin-bottom:16px;">
          ${compare.goodTitle || "✨ SUARE ОНЛАЙН"}
        </div>
        <ul style="margin:0; padding-left:20px; font-size:22px; color:#F4F4F2; line-height:1.6;">
          ${compare.goodItems.map((i) => `<li style="margin-bottom:12px;">${i}</li>`).join("")}
        </ul>
      </div>
    </div>`;
  }

  const [fr1, fr2] = footerRight || ["<b>@suare.app</b> · suare.app", "Қазақстан & ТМД"];

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  ${baseHead(depth, title)}
</head>
<body>
  <div class="canvas">
    ${photoBlock}
    <div class="grain"></div>
    <div class="scan-line"></div>
    ${headerBar(depth, index, total)}

    <div class="slide-body">
      ${kicker ? `<div class="section-marker">${kicker}</div>` : ""}
      ${iconBlock}
      <h1 class="slide-headline font-display" style="font-size:${effectiveSize}px;">
        ${headlineHtml}
      </h1>
      ${body ? `<p class="slide-desc">${body}</p>` : ""}
      ${chipsBlock}
      ${mockupBlock}
      ${compareBlock}
    </div>

    ${footerBar(fr1, fr2)}
  </div>
</body>
</html>`;
}

/**
 * Builds 16:9 YouTube Video Cover / Thumbnail (1920x1080)
 */
function buildCover(opts) {
  const {
    depth = 3,
    title = "SUARE",
    lesson = null,
    total = 20,
    kicker = "SUARE · ОБУЧАЮЩИЙ КУРС",
    headlineLines = [],
    headlineSize = 82,
    sub = "",
    icon = null,
    chips = [],
    photo = null,
  } = opts;

  const shared = relShared(depth);
  const maxChars = Math.max(1, ...headlineLines.map((l) => l.text.length));
  const fitSize = Math.floor(1100 / (maxChars * 0.82));
  const effectiveSize = Math.min(headlineSize, fitSize);

  const headlineHtml = headlineLines
    .map((l) => {
      if (l.mode === "stroke") {
        return `<span class="text-stroke" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      if (l.mode === "accent") {
        return `<span class="text-gold" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      return `<span style="display:block; white-space:nowrap;">${l.text}</span>`;
    })
    .join("\n        ");

  const chipsBlock = chips.length
    ? `<div class="yt-chips">
        ${chips.map((c) => `<span class="yt-chip">${c}</span>`).join("\n        ")}
      </div>`
    : "";

  const photoBlock = photo
    ? `<div class="bg-photo"><img src="${photo}" alt=""></div>
       <div class="photo-overlay"></div>`
    : "";

  const num = lesson !== null ? String(lesson).padStart(2, "0") : "";
  const ghostNum = num ? `<div class="yt-ghost-num">${num}</div>` : "";
  const indexBlock = num
    ? `<div class="slide-index">УРОК <b>${num}</b> / ${String(total).padStart(2, "0")}</div>`
    : `<div class="slide-index">ПЛЕЙЛИСТ · <b>${String(total).padStart(2, "0")} ВИДЕО</b></div>`;
  const iconBlock = icon ? `<div class="yt-icon">${iconSvg(icon, 120, "hsl(var(--primary))")}</div>` : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  ${baseHead(depth, title)}
</head>
<body>
  <div class="canvas wide">
    ${photoBlock}
    ${ghostNum}
    <div class="grain"></div>
    <div class="scan-line"></div>

    <div class="header-bar" style="top:50px; left:90px; right:90px;">
      <div class="logo-wrap">
        <img src="${shared}/logo-light.svg" alt="SUARE" style="height:54px;">
      </div>
      ${indexBlock}
    </div>

    ${iconBlock}

    <div class="yt-body">
      <div class="section-marker">${kicker}</div>
      <h1 class="font-display" style="font-size:${effectiveSize}px;">
        ${headlineHtml}
      </h1>
      ${sub ? `<p class="yt-sub">${sub}</p>` : ""}
      ${chipsBlock}
    </div>

    <div class="yt-foot">
      <span><b>suare.app</b></span>
      <span class="sep">·</span>
      <span>@suare.app</span>
      <span class="sep">·</span>
      <span>Онлайн-шақыру жасау</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Builds 9:16 Vertical Story & TikTok Cover (1080x1920)
 */
function buildStory(opts) {
  const {
    depth = 3,
    title = "SUARE",
    kicker = "",
    headlineLines = [],
    headlineSize = 88,
    body = "",
    icon = null,
    chips = [],
    mockup = null,
    photo = null,
  } = opts;

  const maxChars = Math.max(1, ...headlineLines.map((l) => l.text.length));
  const fitSize = Math.floor(900 / (maxChars * 0.82));
  const effectiveSize = Math.min(headlineSize, fitSize);

  const headlineHtml = headlineLines
    .map((l) => {
      if (l.mode === "stroke") {
        return `<span class="text-stroke" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      if (l.mode === "accent") {
        return `<span class="text-gold" style="display:block; white-space:nowrap;">${l.text}</span>`;
      }
      return `<span style="display:block; white-space:nowrap;">${l.text}</span>`;
    })
    .join("\n        ");

  const iconBlock = icon
    ? `<div class="notch-gold" style="width:130px; height:130px; display:flex; align-items:center; justify-content:center; margin-bottom:40px;">
        ${iconSvg(icon, 68, "hsl(var(--primary))")}
      </div>`
    : "";

  const chipsBlock = chips.length
    ? `<div class="slide-chips" style="margin-top:40px;">
        ${chips.map((c) => `<span class="slide-chip gold" style="font-size:20px; padding:14px 26px;">${c}</span>`).join("\n        ")}
      </div>`
    : "";

  const photoBlock = photo
    ? `<div class="bg-photo"><img src="${photo}" alt=""></div>
       <div class="photo-overlay"></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  ${baseHead(depth, title)}
</head>
<body>
  <div class="canvas tall">
    ${photoBlock}
    <div class="grain"></div>
    <div class="scan-line"></div>
    ${headerBar(depth)}

    <div class="slide-body" style="top:220px; bottom:180px;">
      ${kicker ? `<div class="section-marker" style="font-size:24px; padding:10px 24px;">${kicker}</div>` : ""}
      ${iconBlock}
      <h1 class="slide-headline font-display" style="font-size:${effectiveSize}px;">
        ${headlineHtml}
      </h1>
      ${body ? `<p class="slide-desc" style="font-size:32px; max-width:920px;">${body}</p>` : ""}
      ${chipsBlock}
    </div>

    ${footerBar("<b>@suare.app</b> · TikTok & Reels", "suare.app")}
  </div>
</body>
</html>`;
}

module.exports = { buildSlide, buildCover, buildStory, iconSvg };
