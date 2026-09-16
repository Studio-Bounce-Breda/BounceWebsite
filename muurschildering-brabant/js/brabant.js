document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.whatsapp-link').forEach(function (link) {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#contact') {
      link.setAttribute('href', 'https://wa.me/31600000000');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    }
  });
});
