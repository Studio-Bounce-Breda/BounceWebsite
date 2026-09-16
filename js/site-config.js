// Shared site settings managed by SiteEdit.
// WhatsApp number: international format, digits only.
window.SITEEDIT_SITE_CONFIG = {
  whatsappNumber: '31657114682'
};

(function () {
  function cleanNumber(value) {
    return String(value || '').replace(/D/g, '');
  }

  function messageFromHref(href) {
    try {
      const url = new URL(href, window.location.href);
      return url.searchParams.get('text') || '';
    } catch { return ''; }
  }

  function buildWhatsAppUrl(message) {
    const number = cleanNumber(window.SITEEDIT_SITE_CONFIG && window.SITEEDIT_SITE_CONFIG.whatsappNumber);
    if (!number) return '#';
    const base = `https://wa.me/${number}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  function applyWhatsAppLinks(root = document) {
    const pageMessage = document.body ? (document.body.dataset.whatsappMessage || '') : '';
    const selector = '.whatsapp-link, a[href*="wa.me/"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com/send"]';
    root.querySelectorAll(selector).forEach((link) => {
      const explicit = link.dataset.whatsappMessage;
      const message = explicit !== undefined ? explicit : (messageFromHref(link.getAttribute('href') || '') || pageMessage);
      link.href = buildWhatsAppUrl(message);
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }

  window.SiteEditSite = window.SiteEditSite || {};
  window.SiteEditSite.buildWhatsAppUrl = buildWhatsAppUrl;
  window.SiteEditSite.applyWhatsAppLinks = applyWhatsAppLinks;
  document.addEventListener('DOMContentLoaded', () => applyWhatsAppLinks());
})();
