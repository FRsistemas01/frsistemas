/* Red de seguridad: si GSAP/Lenis no cargan (CDN bloqueado, sin internet,
   webview restringido) o algo falla, se fuerza a mostrar todo el contenido
   sin animaciones en vez de dejar la página en blanco. */
(function () {
  function forceVisible() {
    document.documentElement.classList.add('no-anim');
    var pre = document.querySelector('.preloader');
    if (pre) pre.style.display = 'none';
    document.body && document.body.classList.add('loaded');
  }
  window.forceVisible = forceVisible;
  if (typeof gsap === 'undefined' || typeof Lenis === 'undefined') {
    forceVisible();
  }
  window.addEventListener('error', forceVisible);
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      if (!document.body.classList.contains('loaded')) forceVisible();
    }, 2500);
  });
})();
