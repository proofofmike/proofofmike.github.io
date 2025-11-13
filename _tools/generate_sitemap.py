#!/usr/bin/env python3
import json
import pathlib
import re

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
]

def slugify(s: str) -> str:
    """
    Match the JS slugify used for tags:
    - lowercase
    - replace '+' with 'plus'
    - non-alphanumeric -> '-'
    - trim leading/trailing '-'
    """
    s = s.lower().replace("+", "plus")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")

def load_posts():
    with POSTS_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)

def build_urls(posts):
    urls = []

    # 1) Static pages
    urls.extend(STATIC_PATHS)

    # 2) Blog posts
    for p in posts:
        # Prefer slug if present, otherwise derive from source
        if "slug" in p and p["slug"]:
            path = "/posts/" + p["slug"]
        else:
            # e.g. /posts/2025-11-12-foo.md -> /posts/2025-11-12-foo.html
            src = p.get("source", "")
            path = src.replace(".md", ".html")
        urls.append(path)

    # 3) Tag pages (based on all tags across posts)
    tag_slugs = set()
    for p in posts:
        for t in p.get("tags", []) or []:
            tag_slugs.add(slugify(t))

    for tslug in sorted(tag_slugs):
        urls.append(f"/tags/{tslug}.html")

    # Deduplicate while preserving order
    seen = set()
    final_urls = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            final_urls.append(u)

    return final_urls

def to_full_url(path: str) -> str:
    if path == "/":
        return BASE_URL + "/"
    return BASE_URL.rstrip("/") + "/" + path.lstrip("/")

def generate_sitemap(urls):
    lines = [
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ]

    for path in urls:
        loc = to_full_url(path)
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append("  </url>")

    lines.append("</urlset>")
    return "\n".join(lines) + "\n"

def main():
    if not POSTS_JSON.exists():
        raise SystemExit(f"posts.json not found at {POSTS_JSON}")

    posts = load_posts()
    urls = build_urls(posts)
    xml = generate_sitemap(urls)

    SITEMAP_XML.write_text(xml, encoding="utf-8")
    print(f"Wrote sitemap with {len(urls)} URLs to {SITEMAP_XML}")

if __name__ == "__main__":
    main()
