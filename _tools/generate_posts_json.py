#!/usr/bin/env python3
import os
import json
import re
from pathlib import Path
from datetime import datetime

# ---- Config ----
REPO_ROOT = Path(__file__).parent.parent

# Try "posts" first, then "post"
POSTS_DIR = REPO_ROOT / "posts"
if not POSTS_DIR.is_dir():
    alt = REPO_ROOT / "post"
    if alt.is_dir():
        POSTS_DIR = alt
    else:
        raise SystemExit("Could not find 'posts/' or 'post/' directory")

# Path used in the "source" field in posts.json
# Change to "/post" if your markdown lives there
SOURCE_PREFIX = "/posts"


def parse_date(date_str, fallback_dt):
    if not date_str:
        return fallback_dt
    try:
        # Works for "YYYY-MM-DD" and "YYYY-MM-DDTHH:MM:SS"
        return datetime.fromisoformat(date_str)
    except Exception:
        try:
            # Try just the date part
            return datetime.strptime(date_str[:10], "%Y-%m-%d")
        except Exception:
            return fallback_dt


def extract_metadata(md_path: Path):
    """
    Extract date, slug, title from a markdown file.

    Convention:
    - Filename: YYYY-MM-DD-some-title.md (date is optional)
    - Title: first line starting with '#'
    """
    name = md_path.name
    stem = md_path.stem  # without .md

    # Defaults
    date_str = None
    title = None

    # Try to parse date from filename: YYYY-MM-DD-...
    m = re.match(r"(\d{4}-\d{2}-\d{2})-(.+)", stem)
    if m:
        date_str = m.group(1)

    # Fallback date from mtime
    default_dt = datetime.fromtimestamp(md_path.stat().st_mtime)
    if not date_str:
        date_str = default_dt.strftime("%Y-%m-%d")

    # Read file and look for first Markdown heading as title
    with md_path.open("r", encoding="utf-8") as f:
        for line in f:
            stripped = line.strip()
            if stripped.startswith("#"):
                title = stripped.lstrip("#").strip()
                if title:
                    break

    if not title:
        # Fallback: derive a title from the filename part after the date
        if m:
            slug_part = m.group(2)
        else:
            slug_part = stem
        title = slug_part.replace("-", " ").replace("_", " ").title()

    slug = f"{stem}.html"
    source = f"{SOURCE_PREFIX}/{name}"

    meta = {
        "title": title,
        "slug": slug,
        "date": date_str,
        "source": source,
        "tags": [],
        "_default_dt": default_dt,
    }
    return meta


def main():
    # Load existing posts.json if present so we can preserve tags/dates
    existing_by_slug = {}
    posts_json_path = POSTS_DIR / "posts.json"
    if posts_json_path.is_file():
        try:
            with posts_json_path.open("r", encoding="utf-8") as f:
                existing_posts = json.load(f)
            for p in existing_posts:
                slug = p.get("slug")
                if slug:
                    existing_by_slug[slug] = p
        except Exception:
            print("Warning: could not parse existing posts.json, starting fresh")

    md_files = sorted(POSTS_DIR.glob("*.md"))
    if not md_files:
        raise SystemExit(f"No .md files found in {POSTS_DIR}")

    posts = []
    for md_path in md_files:
        meta = extract_metadata(md_path)
        slug = meta["slug"]
        existing = existing_by_slug.get(slug)

        if existing:
            # Preserve existing date if present
            if existing.get("date"):
                meta["date"] = existing["date"]

            # Preserve tags if present
            if "tags" in existing and existing["tags"]:
                meta["tags"] = existing["tags"]

            # Optionally preserve manually-edited title
            if existing.get("title"):
                meta["title"] = existing["title"]

        # Build actual sort datetime
        meta["_sort_dt"] = parse_date(meta["date"], meta["_default_dt"])

        posts.append(meta)

    # Sort newest → oldest
    posts.sort(key=lambda p: p["_sort_dt"], reverse=True)

    # Strip internal sort keys before writing JSON
    for p in posts:
        p.pop("_sort_dt", None)
        p.pop("_default_dt", None)

    with posts_json_path.open("w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(posts)} posts to {posts_json_path}")


if __name__ == "__main__":
    main()
