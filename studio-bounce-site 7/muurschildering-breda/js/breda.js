
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('.whatsapp-link').forEach(function (link) {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#contact') {
      link.setAttribute('href', 'https://wa.me/31600000000');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav && !toggle.dataset.bound) {
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
