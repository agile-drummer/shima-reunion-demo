(() => {
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('#site-nav');
  if (!button || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    nav.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  };

  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(event.target) || button.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
