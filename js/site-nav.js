/* Shared mobile navigation for every Studio Bounce page. */
(() => {
  const bound = new WeakSet();

  function initMobileNav() {
    document.querySelectorAll('.site-header').forEach(header => {
      const toggle = header.querySelector('.mobile-toggle');
      const nav = header.querySelector('.main-nav');
      if (!toggle || !nav || bound.has(toggle)) return;
      bound.add(toggle);

      const close = () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      };

      // Runtime/editor state should never make the live menu start opened.
      close();

      toggle.addEventListener('click', event => {
        event.preventDefault();
        const open = !nav.classList.contains('open');
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });

      nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

      document.addEventListener('click', event => {
        if (nav.classList.contains('open') && !header.contains(event.target)) close();
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') close();
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 860) close();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav, { once: true });
  } else {
    initMobileNav();
  }
})();
