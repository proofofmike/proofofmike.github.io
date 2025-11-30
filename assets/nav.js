document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('site-nav');
  if (!container) return;

  fetch('/assets/nav.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Nav fetch failed: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      container.innerHTML = html;

      const dropdowns = container.querySelectorAll('.nav-dropdown');

      dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        if (!toggle || !menu) return;

        const openMenu = () => {
          menu.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        };

        const toggleMenu = () => {
          const isOpen = menu.classList.contains('open');
          // close other open menus
          container.querySelectorAll('.nav-dropdown-menu.open').forEach((other) => {
            if (other !== menu) {
              other.classList.remove('open');
              const otherToggle = other
                .closest('.nav-dropdown')
                ?.querySelector('.nav-dropdown-toggle');
              if (otherToggle) {
                otherToggle.setAttribute('aria-expanded', 'false');
              }
            }
          });

          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        };

        // Mouse click
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
        });

        // Keyboard support
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          } else if (e.key === 'Escape') {
            closeMenu();
            toggle.focus();
          }
        });

        // Close when you click a menu item
        menu.addEventListener('click', (e) => {
          if (e.target.closest('a')) {
            closeMenu();
          }
        });
      });

      // Close dropdowns on click outside
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          container.querySelectorAll('.nav-dropdown-menu.open').forEach((menu) => {
            menu.classList.remove('open');
            const toggle = menu
              .closest('.nav-dropdown')
              ?.querySelector('.nav-dropdown-toggle');
            if (toggle) {
              toggle.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    })
    .catch((err) => {
      console.error('Failed to load nav:', err);
    });
});
