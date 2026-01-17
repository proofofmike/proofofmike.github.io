// /assets/blog.js

function formatDate(dateStr) {
  // dateStr is "YYYY-MM-DD"
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;

  // Construct as LOCAL date to avoid UTC shifting to the prior day
  const d = new Date(parts[0], parts[1] - 1, parts[2]);

  const opts = { year: "numeric", month: "short", day: "numeric" };
  return d.toLocaleDateString(undefined, opts); // browser locale
}

// Render full list on /posts/
function renderPostList() {
  const container = document.getElementById("post-list");
  if (!container) return;

  fetch("/posts/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      // sort by date descending (newest first)
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));

      const itemsHtml = posts
        .map((post) => {
          const url = `/posts/${post.slug}`;
          const prettyDate = formatDate(post.date);

          return `
            <div class="item">
              <h2>
                <a href="${url}">${post.title}</a>
              </h2>
              <div class="muted" style="font-size:0.85rem;margin-top:2px;">
                ${prettyDate}
              </div>
            </div>
          `;
        })
        .join("");

      container.innerHTML = itemsHtml || '<p class="muted">No posts yet.</p>';
    })
    .catch((err) => {
      console.error("Error loading posts.json", err);
      container.innerHTML =
        '<p class="muted">Could not load posts right now. Please try again later.</p>';
    });
}

// Render latest post on the homepage WITH an excerpt
function renderLatestPost() {
  const slot = document.getElementById("latest-post");
  if (!slot) return;

  fetch("/posts/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        slot.innerHTML = '<p class="muted">No posts yet.</p>';
        return;
      }

      // newest first
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      const latest = posts[0];

      const url = `/posts/${latest.slug}`;
      const prettyDate = formatDate(latest.date);

      // Now fetch the actual post HTML to grab the first paragraph as an excerpt
      return fetch(url)
        .then((res) => res.text())
        .then((html) => {
          let excerpt = "";

          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Try a few reasonable locations for the first paragraph
            const firstP =
              doc.querySelector("main p") ||
              doc.querySelector(".post p") ||
              doc.querySelector("article p") ||
              doc.querySelector("p");

            if (firstP) {
              excerpt = firstP.textContent.trim();
            }
          } catch (e) {
            console.error("Error parsing latest post HTML", e);
          }

          if (excerpt.length > 260) {
            excerpt = excerpt.slice(0, 257).trimEnd() + "…";
          }

          slot.innerHTML = `
            <h3 style="margin-top:0;">
              <a href="${url}">${latest.title}</a>
            </h3>
            <div class="muted" style="font-size:0.85rem;margin-bottom:0.5rem;">
              ${prettyDate}
            </div>
            ${
              excerpt
                ? `<p class="muted" style="margin-top:0;margin-bottom:0.7rem;">${excerpt}</p>`
                : ""
            }
            <p class="muted" style="margin:0;">
              <a href="${url}" class="link-blue">Read this post →</a>
            </p>
          `;
        });
    })
    .catch((err) => {
      console.error("Error loading latest post", err);
      slot.innerHTML =
        '<p class="muted">Could not load the latest post right now. Please try again later.</p>';
    });
}

// Auto-run on whatever page we're on
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("post-list")) {
    renderPostList();
  }
  if (document.getElementById("latest-post")) {
    renderLatestPost();
  }
});
