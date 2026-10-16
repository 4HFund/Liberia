"""Sync public Notion field updates to a safe static JSON feed.
Requires NOTION_TOKEN secret. Never commit a token to this repository.
"""
import json
import os
import urllib.request
from pathlib import Path

TOKEN = os.environ.get("NOTION_TOKEN", "")
SOURCE = os.environ.get("NOTION_DATA_SOURCE_ID", "")
DEST = Path("assets/field-updates.json")
if not TOKEN:
    raise SystemExit("NOTION_TOKEN GitHub secret is not configured. No changes made.")
if not SOURCE:
    raise SystemExit("Missing NOTION_DATA_SOURCE_ID.")

def notion(endpoint, payload):
    request = urllib.request.Request(
        "https://api.notion.com/v1/" + endpoint,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": "Bearer " + TOKEN,
            "Notion-Version": "2025-09-03",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)

def plain(prop):
    return "".join(t.get("plain_text", "") for t in prop.get("rich_text", []) or prop.get("title", []))

entries = []
cursor = None
while True:
    query = {"page_size": 100, "filter": {"property": "Status", "select": {"equals": "Published"}}}
    if cursor:
        query["start_cursor"] = cursor
    result = notion("data_sources/" + SOURCE + "/query", query)
    for page in result.get("results", []):
        props = page.get("properties", {})
        date = (props.get("Date", {}).get("date") or {}).get("start", "")
        category = (props.get("Category", {}).get("select") or {}).get("name", "Story")
        photos = props.get("Photo", {}).get("files") or []
        # Notion signed file URLs expire, so do not publish them as persistent images.
        # Externally hosted stable HTTPS photo URLs can be used.
        photo = next((p.get("external", {}).get("url", "") for p in photos if p.get("type") == "external"), "")
        entries.append({
            "title": plain(props.get("Title", {})),
            "date": date,
            "status": "Published",
            "category": category,
            "summary": plain(props.get("Summary", {})),
            "prayerFocus": plain(props.get("Prayer Focus", {})),
            "photo": photo,
            "url": page.get("public_url") or page.get("url", ""),
        })
    if not result.get("has_more"):
        break
    cursor = result.get("next_cursor")
    if not cursor:
        break

entries.sort(key=lambda item: item["date"], reverse=True)
content = {"entries": entries}
DEST.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n")
print(f"Synced {len(entries)} published field updates.")
