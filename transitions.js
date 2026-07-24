// Fade-out transition when clicking internal links
(function(){
  var isLeaving = false;

  // Reset the leaving state if the page is restored from the back/forward cache,
  // otherwise it could remain faded out (and block further transitions) after a Back navigation.
  window.addEventListener('pageshow', function(){
    isLeaving = false;
    document.body.classList.remove('is-leaving');
  });

  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('click', function(e){
    // Let modified clicks (new tab, etc.) behave normally
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Only apply to internal same-tab navigation
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('http') && link.hostname !== window.location.hostname) return;

    // Avoid re-triggering if a transition is already underway
    if (isLeaving) return;
    isLeaving = true;

    // Trigger fade-out then navigate. Keep this in sync with --page-leave in style.css.
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function(){
      window.location.href = href;
    }, 280);
  });
})();
