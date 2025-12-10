// /assets/blog.js

function formatDate(dateStr) {
  // dateStr is now just "YYYY-MM-DD"
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr; // fallback

  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString(undefined, opts); // use browser locale
}

function renderPostList() {
  const container = document.getElementById('post-list');
  if (!container) return;

  fetch('/posts/posts.json')
    .then((res) => res.json())
    .then((posts) => {
      // sort by date descending
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
