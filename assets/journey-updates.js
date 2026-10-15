/* Liberia journal connection: fill both links when the Notion page is published.
   Public URL: Notion Share > Publish > Copy link.
   Embed URL: Notion Share > Publish > Embed this page > Copy code,
              then copy the src="" value from Notion's iframe code.
   Both are intentionally blank until the page is actually public.
*/
(()=>{
  "use strict";
  const notionPublicUrl = "";
  const notionEmbedUrl = "";
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
  const embedUrl = safeNotionUrl(notionEmbedUrl);
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
  if (embedUrl) {
    iframe.src = embedUrl;
    iframeWrap.hidden = false;
    empty.hidden = true;
    feed.dataset.ready = "true";
    status.textContent = "Updates from Liberia";
  }
})();
