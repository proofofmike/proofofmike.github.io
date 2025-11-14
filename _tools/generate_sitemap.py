#!/usr/bin/env python3
import json
import pathlib
import re
from datetime import datetime

# Base URL for your site
BASE_URL = "https://proofofmike.com"

# Paths relative to the repo root (run this script from repo root)
REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
POSTS_JSON = REPO_ROOT / "posts" / "posts.json"
SITEMAP_XML = REPO_ROOT / "sitemap.xml"

# Static URLs that should always be in the sitemap
STATIC_PATHS = [
    "/",                 # home
    "/about.html",
    "/contact.html",
    "/posts/",
    "/tch/",
    "/solo-calc/",
]

def slugify(s: str) -> str:
    """
    Match the JS slugify used for tags on the site:
    - replace '+' with 'plus'
    - lowercase
    - convert non-alphanumerics into '-'
    - trim leading/trailing '-'
    """
    s = s.replace("+", "plus")
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def load_posts():
    with POSTS_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)

def normalize_date(date_str: str) -> str:
    """
    Take the `date` field from posts.json (e.g. '2025-11-14T10:07:00')
    and return just 'YYYY-MM-DD' for <lastmod>.
    """
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.date().isoformat()
    except Exception:
        # If something is weird, just return the original or skip lastmod
        return date_str.split("T")[0]

def build_urls_and_lastmods(posts):
    urls = []
    lastmods = {}

    # 1) Static pages (no lastmod for now)
    urls.extend(STATIC_PATHS)

    # 2) Blog posts (with lastmod from posts.json `date`)
    for p in posts:
        # Prefer slug if present, otherwise derive from source
        if "slug" in p and p["slug"]:
            path = "/posts/" + p["slug"]
        else:
            # e.g. /posts/2025-11-12-foo.md -> /posts/2025-11-12-foo.html
            src = p.get("source", "")
            path = src.replace(".md", ".html")

        urls.append(path)

        # If there's a date field, use it for lastmod
        date_str = p.get("date")
        if date_str:
            lastmods[path] = normalize_date(date_str)

    # 3) Tag pages (no lastmod for now)
    tag_slugs = set()
    for p in posts:
        for t in p.get("tags", []) or []:
            tag_slugs.add(slugify(t))

    for tslug in sorted(tag_slugs):
        path = f"/tags/{tslug}.html"
        urls.append(path)
        # we could optionally assign a lastmod here later if you want

    # Deduplicate while preserving order
    seen = set()
    final_urls = []
    final_lastmods = {}

    for u in urls:
        if u not in seen:
            seen.add(u)
            final_urls.append(u)
            if u in lastmods:
                final_lastmods[u] = lastmods[u]

    return final_urls, final_lastmods

def to_full_url(path: str) -> str:
    if path == "/":
        return BASE_URL + "/"
    return BASE_URL.rstrip("/") + "/" + path.lstrip("/")

def generate_sitemap(urls, lastmods):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    for path in urls:
        loc = to_full_url(path)
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lm = lastmods.get(path)
        if lm:
            lines.append(f"    <lastmod>{lm}</lastmod>")
        lines.append("  </url>")

    lines.append("</urlset>")
    return "\n".join(lines) + "\n"

def main():
    if not POSTS_JSON.exists():
        raise SystemExit(f"posts.json not found at {POSTS_JSON}")

    posts = load_posts()
    urls, lastmods = build_urls_and_lastmods(posts)
    xml = generate_sitemap(urls, lastmods)

    SITEMAP_XML.write_text(xml, encoding="utf-8")
    print(f"Wrote sitemap with {len(urls)} URLs to {SITEMAP_XML}")

if __name__ == "__main__":
    main()
