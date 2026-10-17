/* 100 Acres of Hope — published Notion trip journal.
   The embed URL is taken verbatim from the user's Notion-generated iframe.
   Edit the journal in Notion to update this feed; no GitHub edits are needed
   for new entries. Keep the public-page link as a fallback for visitors.
*/
(()=>{
  "use strict";
  const notionPublicUrl = "https://aback-pound-fbd.notion.site/3fa1341516cd817aabd4c8c5b9519d1e";
  const notionEmbedUrl = "https://aback-pound-fbd.notion.site/ebd//3fa1341516cd817aabd4c8c5b9519d1e";
  const section = document.getElementById("updates");
  if (!section) return;
  const feed = section.querySelector(".live-journal-feed");
  const status = section.querySelector("[data-journal-status]");
  const empty = section.querySelector("[data-journal-empty]");
  const emptyTitle = section.querySelector("[data-journal-empty-title]");
  const emptyBody = section.querySelector("[data-journal-empty-body]");
  const iframeWrap = section.querySelector("[data-journal-iframewrap]");
  const iframe = section.querySelector("[data-journal-iframe]");
  const openLink = section.querySelector("[data-journal-open]");
  const safeNotionUrl = (input) => {
    try {
      const url = new URL(input);
      if (url.protocol !== "https:") return null;
      const host = url.hostname.toLowerCase();
      if (!(host === "notion.site" || host.endsWith(".notion.site") || host === "notion.com" || host.endsWith(".notion.com") || host === "notion.so" || host.endsWith(".notion.so"))) return null;
      return url.href;
    } catch { return null; }
  };
  const publicUrl = safeNotionUrl(notionPublicUrl);
  // Keep the journal as a direct link on mobile and desktop. The third-party iframe caused scrolling glitches, especially in iOS Safari.
  const embedUrl = null;
  if (publicUrl) {
    openLink.href = publicUrl;
    openLink.hidden = false;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    feed.dataset.ready = "true";
    status.textContent = "Updates from Liberia";
    emptyTitle.textContent = "Our journal is now open.";
    emptyBody.textContent = "Read the latest stories, photos, and prayer updates from Pastor Bobby and Sidney. New posts will appear as connections allow.";
  }
  const latest = document.createElement("article");
  latest.className = "live-journal-featured";
  latest.style.cssText = "margin:20px 0;padding:24px;border:1px solid rgba(180,130,70,.35);border-radius:16px;background:rgba(255,255,255,.06)";
  latest.innerHTML = '<div style="font-size:.76rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px">FIELD UPDATE · OCTOBER 17, 2026</div><h3 style="font-size:clamp(1.4rem,3vw,2rem);margin:0 0 12px">✈️ We Made It to Monrovia!</h3><p style="line-height:1.65;margin-bottom:14px">After a brutal stretch of travel, we arrived in Monrovia at 2:45 p.m. local time. We shared dinner with Glenn and his wife from Free Methodist World Missions to discuss our plans. Tomorrow we travel to Bomi, where Pastor Bobby will preach.</p><p style="line-height:1.6;margin-bottom:16px"><strong>Prayer focus:</strong> Rest, safe travels, and Pastor Bobby as he prepares to preach.</p><a href="https://app.notion.com/p/3fc1341516cd81109cc9c1d1ad6f7799" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#bc7c42;color:#111;text-decoration:none;font-weight:700">Read the full update &amp; view photos ↗</a>';
  const feedbar = section.querySelector(".live-journal-feedbar");
  if (feedbar) feedbar.insertAdjacentElement("afterend", latest);
  if (status) status.textContent = "Latest field update · October 17";
  if (empty) empty.hidden = true;
  if (embedUrl) {
    iframe.src = embedUrl;
    iframeWrap.hidden = false;
    empty.hidden = true;
    feed.dataset.ready = "true";
    status.textContent = "Updates from Liberia";
  }
})();
