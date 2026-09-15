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
// 15-09-2026 — use homepage gallery category as image source
// The homepage gallery is the source of truth. When images are added/reordered
// in the "kinderkamers" category, this page follows automatically.
async function syncKinderkamerCategoryImages() {
  const targets = Array.from(document.querySelectorAll('img[data-category-source="kinderkamers"]'));
  if (!targets.length) return;

  try {
    const homeUrl = new URL('../index.html', window.location.href);
    const response = await fetch(homeUrl.href, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Homepage request failed (${response.status})`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const baseUrl = response.url || homeUrl.href;

    const categoryImages = Array.from(doc.querySelectorAll('.gallery-card[data-cat]'))
      .filter(card => (card.dataset.cat || '').split(/\s+/).includes('kinderkamers'))
      .map(card => card.querySelector('img'))
      .filter(Boolean)
      .map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || ''
      }))
      .filter(item => item.src);

    if (!categoryImages.length) return;

    targets.forEach((target, fallbackIndex) => {
      const requestedIndex = Number.parseInt(target.dataset.categoryImageIndex || '', 10);
      const index = Number.isFinite(requestedIndex) ? requestedIndex : fallbackIndex;
      const source = categoryImages[index % categoryImages.length];

      target.src = new URL(source.src, baseUrl).href;
      if (source.alt.trim()) target.alt = source.alt.trim();
    });
  } catch (error) {
    // Keep the HTML fallback images when the homepage cannot be fetched
    // (for example when opening the files directly from disk).
    console.warn('Kinderkamers category images could not be synced:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncKinderkamerCategoryImages, { once: true });
} else {
  syncKinderkamerCategoryImages();
}
