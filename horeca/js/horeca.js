// Category page image sync: the homepage gallery is the source of truth.
// If the homepage contains `horeca` gallery items, this page follows them automatically.
(() => {
  const CATEGORY = "horeca";

  function setYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  async function syncCategoryImages() {
    const targets = Array.from(document.querySelectorAll(`img[data-category-source="${CATEGORY}"]`));
    if (!targets.length) return;

    try {
      const homeUrl = new URL('../index.html', window.location.href);
      const response = await fetch(homeUrl.href, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Homepage request failed (${response.status})`);

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const baseUrl = response.url || homeUrl.href;
      const categoryImages = Array.from(doc.querySelectorAll('.gallery-card[data-cat]'))
        .filter(card => (card.dataset.cat || '').split(/\s+/).includes(CATEGORY))
        .map(card => card.querySelector('img'))
        .filter(Boolean)
        .map(img => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' }))
        .filter(item => item.src);

      if (!categoryImages.length) return;

      targets.forEach((target, fallbackIndex) => {
        const requestedIndex = Number.parseInt(target.dataset.categoryImageIndex || '', 10);
        const index = Number.isFinite(requestedIndex) ? requestedIndex : fallbackIndex;
        // Do not repeat a single photo across the whole page when a category only has a few images yet.
        if (index >= categoryImages.length) return;
        const source = categoryImages[index];
        target.src = new URL(source.src, baseUrl).href;
        if (source.alt.trim()) target.alt = source.alt.trim();
      });
    } catch (error) {
      // Keep HTML fallbacks when the homepage cannot be fetched (e.g. file:// preview).
      console.warn(`${CATEGORY} category images could not be synced:`, error);
    }
  }

  function init() { setYear(); syncCategoryImages(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
