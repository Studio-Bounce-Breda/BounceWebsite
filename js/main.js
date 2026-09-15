
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_URL = 'https://wa.me/31600000000'; // TODO: vervang door echte nummer

  /* Mobile nav */
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
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

  /* WhatsApp */
  document.querySelectorAll('.whatsapp-link').forEach(link => {
    link.href = WHATSAPP_URL;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  /* Portfolio filter + compact tablet/mobile gallery */
  const filters = Array.from(document.querySelectorAll('.filter'));
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const galleryLoadMore = document.querySelector('.gallery-load-more');
  const compactGallery = window.matchMedia('(max-width: 860px)');
  const GALLERY_BATCH = 6;
  let activeFilter = filters.find(item => item.classList.contains('active'))?.dataset.filter || 'all';
  let galleryVisibleCount = GALLERY_BATCH;

  function cardMatchesFilter(card, filter) {
    if (filter === 'all') return true;
    return (card.dataset.cat || '').split(/\s+/).includes(filter);
  }

  function orderedPortfolioCards(filter) {
    const matching = cards.filter(card => cardMatchesFilter(card, filter));
    if (filter !== 'all') return matching;

    // "Alle" starts with one representative image from each current category.
    // Because this reads the filter buttons dynamically, new SiteEdit categories
    // automatically participate without hard-coding category names here.
    const categoryKeys = filters
      .map(button => button.dataset.filter)
      .filter(key => key && key !== 'all');
    const representatives = [];
    categoryKeys.forEach(key => {
      const card = matching.find(item => cardMatchesFilter(item, key));
      if (card && !representatives.includes(card)) representatives.push(card);
    });
    matching.forEach(card => {
      if (!representatives.includes(card)) representatives.push(card);
    });
    return representatives;
  }

  function applyPortfolioView({ reset = false } = {}) {
    if (reset) galleryVisibleCount = GALLERY_BATCH;
    const ordered = orderedPortfolioCards(activeFilter);
    const compact = compactGallery.matches;
    const visibleSet = new Set(compact ? ordered.slice(0, galleryVisibleCount) : ordered);

    cards.forEach(card => {
      card.hidden = !cardMatchesFilter(card, activeFilter) || (compact && !visibleSet.has(card));
    });

    if (galleryLoadMore) {
      const hasMore = compact && galleryVisibleCount < ordered.length;
      galleryLoadMore.hidden = !hasMore;
      galleryLoadMore.setAttribute('aria-hidden', String(!hasMore));
    }

    closeLightbox();
  }

  filters.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filters.forEach(item => item.classList.toggle('active', item === button));
      applyPortfolioView({ reset: true });
    });
  });

  galleryLoadMore?.addEventListener('click', () => {
    galleryVisibleCount += GALLERY_BATCH;
    applyPortfolioView();
  });

  const refreshCompactGallery = () => applyPortfolioView({ reset: true });
  if (typeof compactGallery.addEventListener === 'function') {
    compactGallery.addEventListener('change', refreshCompactGallery);
  } else if (typeof compactGallery.addListener === 'function') {
    compactGallery.addListener(refreshCompactGallery);
  }

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.querySelector('.lightbox-image');
  const lbCaption = document.querySelector('.lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');
  let lbIndex = 0;

  function visibleCards() {
    return cards.filter(card => !card.hidden);
  }

  function renderLightbox(index) {
    const visible = visibleCards();
    if (!visible.length || !lbImage) return;
    lbIndex = (index + visible.length) % visible.length;

    const img = visible[lbIndex].querySelector('img');
    lbImage.src = img.currentSrc || img.src;
    lbImage.alt = img.alt || '';
    if (lbCaption) lbCaption.textContent = img.alt || '';
  }

  function openLightbox(card) {
    if (!lightbox) return;
    const visible = visibleCards();
    renderLightbox(Math.max(0, visible.indexOf(card)));
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  applyPortfolioView({ reset: true });

  cards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => renderLightbox(lbIndex - 1));
  lbNext?.addEventListener('click', () => renderLightbox(lbIndex + 1));

  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') renderLightbox(lbIndex - 1);
    if (event.key === 'ArrowRight') renderLightbox(lbIndex + 1);
  });

  /* Reviews — 3 desktop, 2 tablet, 1 mobile */
  const track = document.querySelector('.reviews-track');
  let reviewCards = track ? Array.from(track.querySelectorAll('.review-card')) : [];
  const prev = document.querySelector('.review-prev');
  const next = document.querySelector('.review-next');
  const dots = document.querySelector('.review-dots');
  let reviewPage = 0;

  function reviewsPerPage() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 860) return 2;
    return 3;
  }

  function reviewMaxPage() {
    return Math.max(0, Math.ceil(reviewCards.length / reviewsPerPage()) - 1);
  }

  function updateDots() {
    if (!dots) return;
    dots.innerHTML = '';
    for (let i = 0; i <= reviewMaxPage(); i++) {
      const dot = document.createElement('span');
      dot.className = 'review-dot' + (i === reviewPage ? ' active' : '');
      dots.appendChild(dot);
    }
  }

  function updateReviews() {
    if (!track || !reviewCards.length) return;

    reviewPage = Math.min(reviewPage, reviewMaxPage());
    const viewport = track.parentElement;
    const gap = 14;
    const perPage = reviewsPerPage();
    const cardWidth = (viewport.clientWidth - gap * (perPage - 1)) / perPage;
    const offset = reviewPage * perPage * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    if (prev) prev.disabled = reviewPage <= 0;
    if (next) next.disabled = reviewPage >= reviewMaxPage();
    updateDots();
  }

  prev?.addEventListener('click', () => {
    if (reviewPage > 0) {
      reviewPage--;
      updateReviews();
    }
  });

  next?.addEventListener('click', () => {
    if (reviewPage < reviewMaxPage()) {
      reviewPage++;
      updateReviews();
    }
  });

  function refreshReviewCards() {
    reviewCards = track ? Array.from(track.querySelectorAll('.review-card')) : [];
    reviewPage = 0;
    updateReviews();
  }

  document.addEventListener('studio-bounce:reviews-updated', refreshReviewCards);
  window.addEventListener('resize', updateReviews);
  updateReviews();
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
