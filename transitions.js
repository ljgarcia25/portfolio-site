// Fade-out transition when clicking internal links
(function(){
  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', function(e){
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Only apply to internal same-tab navigation
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('http') && link.hostname !== window.location.hostname) return;

    // Trigger fade-out then navigate
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function(){
      window.location.href = href;
    }, 200);
  });
})();
