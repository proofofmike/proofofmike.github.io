// /assets/blog.js

function formatDate(dateStr) {
  // dateStr is "YYYY-MM-DD"
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr; // fallback

  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString(undefined, opts); // use browser locale
}

// Render full list on /posts/
function renderPostList() {
  const container = document.getElementById('post-list');
  if (!container) return;

  fetch('/posts/posts.json')
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
        .join('');

      container.innerHTML = itemsHtml || '<p class="muted">No posts yet.</p>';
    })
    .catch((err) => {
      console.error('Error loading posts.json', err);
      container.innerHTML =
        '<p class="muted">Could not load posts right now. Please try again later.</p>';
    });
}

// Render a single latest post on the homepage
function renderLatestPost() {
  const slot = document.getElementById('latest-post');
  if (!slot) return;

  fetch('/posts/posts.json')
    .then((res) => res.json())
    .then((posts) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        slot.innerHTML = '<p class="muted">No posts yet.</p>';
        return;
      }

      // sort by date descending and take the newest
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      const latest = posts[0];

      const url = `/posts/${latest.slug}`;
      const prettyDate = formatDate(latest.date);

      slot.innerHTML = `
        <h3 style="margin-top:0;">
          <a href="${url}">${latest.title}</a>
        </h3>
        <div class="muted" style="font-size:0.85rem;margin-bottom:0.5rem;">
          ${prettyDate}
        </div>
        <p class="muted" style="margin:0;">
          <a href="${url}" class="link-blue">Read this post →</a>
        </p>
      `;
    })
    .catch((err) => {
      console.error('Error loading latest post', err);
      slot.innerHTML =
        '<p class="muted">Could not load the latest post right now. Please try again later.</p>';
    });
}
