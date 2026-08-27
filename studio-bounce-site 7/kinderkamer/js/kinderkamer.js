// TODO: vervang door het echte WhatsApp-nummer, alleen cijfers en landcode.
    const WHATSAPP_NUMBER = '31600000000';
    const WHATSAPP_TEXT = 'Hoi! Ik heb interesse in een muurschildering voor een kinderkamer en wil graag wat informatie.';

    document.querySelectorAll('.whatsapp-link').forEach(link => {
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
      link.target = '_blank';
      link.rel = 'noopener';
    });

    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
        toggle.textContent = open ? '×' : '☰';
      });
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.textContent = '☰';
      }));
    }

    document.getElementById('year').textContent = new Date().getFullYear();


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
