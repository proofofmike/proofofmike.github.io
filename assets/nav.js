document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-nav');
  if (!container) return;

  fetch('/assets/nav.html')
    .then((response) => response.text())
    .then((html) => {
      container.innerHTML = html;

      // Attach dropdown behavior after nav is injected
      const toggles = container.querySelectorAll('.nav-dropdown-toggle');

      toggles.forEach((toggle) => {
        const menu = toggle.nextElementSibling;
        if (!menu) return;

        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = menu.classList.toggle('open');
          toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      });

      // Close dropdown if you click anywhere outside
      document.addEventListener('click', (e) => {
        const openMenus = container.querySelectorAll('.nav-dropdown-menu.open');
        openMenus.forEach((menu) => {
          const toggle = menu.previousElementSibling;
          if (
            !menu.contains(e.target) &&
            !toggle.contains(e.target)
          ) {
            menu.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    })
    .catch((err) => {
      console.error('Failed to load nav:', err);
    });
});
