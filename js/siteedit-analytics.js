/* SiteEdit Analytics consent manager. No Google requests until opt-in. */
(function () {
  'use strict';
  const measurementId = window.SITEEDIT_ANALYTICS_ID;
  if (!/^G-[A-Z0-9]{4,20}$/.test(measurementId || '')) return;
  const key = 'siteedit-analytics-consent-v1:' + measurementId;
  const localPreview = location.protocol === 'file:';
  let stored = null;
  try { stored = localStorage.getItem(key); } catch (_) { /* private mode */ }
  if (stored !== 'accepted' && stored !== 'rejected') stored = null;
  let enabled = false;

  function enableAnalytics() {
    if (enabled || localPreview) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  // Consent withdrawal must stop future events, and clear the cookies set by
  // this site's GA tag. Existing information already sent cannot be retracted.
  function removeGaCookies() {
    const cookies = document.cookie.split(';').map(value => value.trim().split('=')[0]);
    const names = cookies.filter(name => /^(_ga($|_)|_gid$|_gat($|_))/.test(name));
    const host = location.hostname;
    const parts = host.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'));
    for (const name of names) for (const domain of domains) {
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
    }
  }
  function saveChoice(accepted) {
    try { localStorage.setItem(key, accepted ? 'accepted' : 'rejected'); } catch (_) {}
    stored = accepted ? 'accepted' : 'rejected';
    if (accepted) enableAnalytics();
    else {
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', {analytics_storage:'denied'});
      removeGaCookies();
      // If visitor previously opted in, a page reload is necessary to unload
      // the already-running third-party script after permission is withdrawn.
      if (enabled && !localPreview) { location.reload(); return; }
    }
    showDialog(false);
  }
  let banner;
  function createFooterLink() {
    // A normal link next to the site's copyright, not a floating control.
    // Generated at runtime, so this works on every page without altering its footer markup.
    const footer = document.querySelector('footer, [role="contentinfo"], .site-footer, #footer');
    if (!footer) return null;
    let target = null;
    for (const node of footer.querySelectorAll('small, p, span, div')) {
      const ownText = (node.textContent || '').trim();
      if (!/(?:©|\u00a9|&copy;|copyright)/i.test(ownText) || ownText.length > 140) continue;
      // Prefer a short, innermost element holding the copyright.
      if (!target || node.querySelectorAll('*').length < target.querySelectorAll('*').length) target = node;
    }
    target = target || footer;
    const link = el('a', 'se-consent-footer-link', 'Cookie-instellingen');
    link.href = '#cookie-instellingen';
    link.setAttribute('data-siteedit-runtime-consent', 'true');
    link.addEventListener('click', event => {
      event.preventDefault();
      if (detailNode) detailNode.hidden = false;
      if (customizeNode) customizeNode.setAttribute('aria-expanded', 'true');
      showDialog(true);
    });
    const separator = el('span', 'se-consent-footer-separator', ' · ');
    separator.setAttribute('data-siteedit-runtime-consent', 'true');
    target.append(separator, link);
    return link;
  }
  let detailNode;
  let customizeNode;
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function button(text, className, action) {
    const btn = el('button', 'se-consent-btn ' + className, text);
    btn.type = 'button';
    btn.addEventListener('click', action);
    return btn;
  }
  function showDialog(open) {
    if (!banner) return;
    banner.hidden = !open;
  }
  function setup() {
    // Older SiteEdit saves could persist the runtime banner as inert HTML.
    // Remove those copies before creating the one live, clickable instance.
    document.querySelectorAll('.se-consent-banner, .se-consent-manage, .se-consent-footer-link, .se-consent-footer-separator').forEach(node => node.remove());
    banner = el('section', 'se-consent-banner');
    banner.setAttribute('data-siteedit-runtime-consent', 'true');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookievoorkeuren');
    banner.setAttribute('aria-modal', 'false');
    banner.hidden = true;
    const heading = el('h2', '', 'Cookies en bezoekersstatistieken');
    const description = el('p', '', 'We gebruiken alleen met jouw toestemming Google Analytics om te begrijpen hoe onze website wordt bezocht. Functionele opslag is altijd actief. Je kunt je keuze later aanpassen.');
    const detail = el('div', 'se-consent-details');
    detail.hidden = true;
    detailNode = detail;
    detail.append(el('p', '', 'Noodzakelijk: altijd actief. Analytisch: Google Analytics (optioneel). Google kan hiervoor cookies plaatsen en gegevens verwerken. Zonder toestemming laden we Google Analytics niet.'));
    const preferenceRow = el('label', 'se-consent-preference');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = stored === 'accepted';
    preferenceRow.append(checkbox, document.createTextNode(' Analytische cookies toestaan'));
    const savePreferences = button('Voorkeur opslaan', 'se-consent-primary', () => saveChoice(checkbox.checked));
    detail.append(preferenceRow, savePreferences);
    const actions = el('div', 'se-consent-actions');
    const reject = button('Alles weigeren', 'se-consent-secondary', () => { checkbox.checked = false; saveChoice(false); });
    const customize = button('Voorkeuren aanpassen', 'se-consent-secondary', () => { detail.hidden = !detail.hidden; customize.setAttribute('aria-expanded', String(!detail.hidden)); });
    customize.setAttribute('aria-expanded', 'false');
    customizeNode = customize;
    const accept = button('Alles accepteren', 'se-consent-primary', () => { checkbox.checked = true; saveChoice(true); });
    actions.append(reject, customize, accept);
    banner.append(heading, description, detail, actions);
    document.body.appendChild(banner);
    createFooterLink();
    showDialog(stored === null);
  }
  if (stored === 'accepted') enableAnalytics();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, {once:true});
  else setup();
})();
