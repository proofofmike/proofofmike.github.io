document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-nav');
  if (!container) return;

  fetch('/assets/nav.html')
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
    })
    .catch(err => {
      console.error('Failed to load nav:', err);
    });
});
