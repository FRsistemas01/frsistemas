/* ==========================================================
   FRSISTEMAS — PORTFOLIO PREMIUM
   Lógica compartida: Lenis, GSAP, cursor, preloader, reveals

   Principio de seguridad: el CSS deja todo VISIBLE por defecto.
   Acá solo animamos "desde" un estado oculto (gsap.from) hacia
   ese estado natural. Si algo de esto falla, el catch de abajo
   llama a window.forceVisible() (definido en fallback.js) y el
   contenido queda visible igual, sin animar.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try {
    runPortfolioScripts();
  } catch (err) {
    console.error('[portfolio] fallo animando la página, mostrando contenido estático:', err);
    if (window.forceVisible) window.forceVisible();
  }
});

function runPortfolioScripts() {

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Lenis smooth scroll ---------- */
  let lenis;
  if (!prefersReduced) {
    try {
      lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } catch (err) {
      console.warn('[portfolio] Lenis no pudo iniciar, sigo sin scroll suave:', err);
    }
  }

  /* ---------- Preloader ---------- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    const pctEl = preloader.querySelector('.pct span');
    const fill = preloader.querySelector('.fill');
    let progress = { v: 0 };
    gsap.to(progress, {
      v: 100,
      duration: prefersReduced ? 0.1 : 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(progress.v);
        if (pctEl) pctEl.textContent = val;
        if (fill) fill.style.width = val + '%';
      },
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          delay: 0.15,
          onComplete: () => { preloader.style.display = 'none'; }
        });
        document.body.classList.add('loaded');
        runHeroReveal();
      }
    });
  } else {
    document.body.classList.add('loaded');
    runHeroReveal();
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (cursor && ring && window.matchMedia('(hover:hover)').matches) {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    window.addEventListener('mousemove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });
    gsap.ticker.add(() => {
      cursor.style.left = pos.x + 'px';
      cursor.style.top = pos.y + 'px';
      ringPos.x += (pos.x - ringPos.x) * 0.15;
      ringPos.y += (pos.y - ringPos.y) * 0.15;
      ring.style.left = ringPos.x + 'px';
      ring.style.top = ringPos.y + 'px';
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        ring.classList.add('hovering');
        const label = el.getAttribute('data-cursor');
        let labelEl = ring.querySelector('.cursor-label');
        if (label && labelEl) labelEl.textContent = label;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    });
  });

  /* ---------- Split de texto palabra por palabra dentro de .reveal-line ----------
     Envuelve cada palabra en .word-mask > .word-inner para poder animar
     un reveal más editorial (palabra por palabra) en vez de la línea entera.
     Si esto falla, el catch general de arriba deja el texto plano visible. */
  function splitWords(el) {
    if (el.dataset.split) return;
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part === '') return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(part)); return; }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = part;
          mask.appendChild(inner);
          el.appendChild(mask);
        });
      } else {
        const mask = document.createElement('span');
        mask.className = 'word-mask';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.appendChild(node.cloneNode(true));
        mask.appendChild(inner);
        el.appendChild(mask);
      }
    });
    el.dataset.split = 'true';
  }
  document.querySelectorAll('.reveal-line > *').forEach(splitWords);

  /* ---------- Hero reveal (lines + fade) — anima DESDE oculto ---------- */
  function runHeroReveal() {
    gsap.from('.hero-reveal .reveal-line .word-inner', {
      yPercent: 115,
      rotate: 4,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.028,
      delay: 0.1
    });
    gsap.from('.hero-reveal .fade-in', {
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power2.out'
    });
  }

  /* ---------- Scroll reveals (genéricos) — anima DESDE oculto ---------- */
  gsap.utils.toArray('.reveal-line:not(.hero-reveal .reveal-line)').forEach(el => {
    gsap.from(el.querySelectorAll('.word-inner'), {
      yPercent: 115,
      rotate: 4,
      duration: 0.85,
      ease: 'power4.out',
      stagger: 0.022,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.fade-up').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 54,
      scale: 0.97,
      duration: 1,
      ease: 'power3.out',
      delay: (i % 3) * 0.05,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.fade-in:not(.hero-reveal .fade-in)').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      duration: 1,
      scrollTrigger: { trigger: el, start: 'top 92%' }
    });
  });

  /* ---------- Cortina de revelado sobre imágenes ----------
     Inyecta un panel que "levanta" al entrar en viewport, más un leve
     zoom-out de la foto por debajo. Los fondos de hero (ya visibles al
     cargar) revelan sin scrollTrigger; el resto revela al hacer scroll. */
  function addCurtain(box, { scaleFrom, scaleTo, onScroll }) {
    if (!box || box.querySelector('.reveal-curtain')) return;
    const curtain = document.createElement('div');
    curtain.className = 'reveal-curtain';
    box.appendChild(curtain);
    const img = box.querySelector('img.shot');
    const tl = gsap.timeline(onScroll ? { scrollTrigger: { trigger: box, start: 'top 85%' } } : { delay: 0.3 });
    tl.fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: 'power4.inOut' }, 0);
    if (img && scaleFrom != null) {
      tl.fromTo(img, { scale: scaleFrom }, { scale: scaleTo, duration: 1.5, ease: 'power3.out' }, 0);
    }
  }
  document.querySelectorAll('.ph-box').forEach(box => addCurtain(box, { scaleFrom: 1.18, scaleTo: 1, onScroll: true }));
  document.querySelectorAll('.full-media').forEach(box => addCurtain(box, { scaleFrom: 1.22, scaleTo: 1.06, onScroll: true }));
  document.querySelectorAll('.site-hero-bg, .case-hero-media').forEach(box => addCurtain(box, { scaleFrom: null, scaleTo: null, onScroll: false }));

  /* ---------- Case study hero parallax ---------- */
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Counter ---------- */
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count'));
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es'); }
        });
      }
    });
  });

  /* ---------- Barra de progreso de lectura ---------- */
  const progressBar = document.querySelector('.scroll-progress .bar');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
    gsap.set(progressBar, { scaleX: 0 });
  }

  /* ---------- Transición al navegar a otra página ---------- */
  const transitionEl = document.querySelector('.page-transition');
  if (transitionEl) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.set(transitionEl, { pointerEvents: 'auto' });
        gsap.fromTo(transitionEl, { yPercent: 100 }, {
          yPercent: 0,
          duration: 0.55,
          ease: 'power3.inOut',
          onComplete: () => { window.location.href = href; }
        });
      });
    });
  }

  /* ---------- Nav background on scroll ---------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -80',
      end: 'max',
      toggleClass: { targets: nav, className: 'scrolled' }
    });
  }

  /* ---------- Carruseles (hscroll + flechas + barra de progreso) ---------- */
  document.querySelectorAll('.carousel').forEach(car => {
    const track = car.querySelector('.hscroll');
    const prevBtn = car.querySelector('.carousel-btn.prev');
    const nextBtn = car.querySelector('.carousel-btn.next');
    const fill = car.querySelector('.carousel-progress .fill');
    if (!track) return;

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      if (fill) {
        const visibleRatio = Math.min(1, track.clientWidth / track.scrollWidth);
        const pct = max > 0 ? track.scrollLeft / max : 0;
        fill.style.width = (visibleRatio * 100) + '%';
        fill.style.transform = `translateX(${pct * (100 / visibleRatio - 100)}%)`;
      }
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 4;
    }
    function scrollByCard(dir) {
      const card = track.querySelector(':scope > *');
      const amount = card ? card.getBoundingClientRect().width + 22 : 320;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    prevBtn && prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn && nextBtn.addEventListener('click', () => scrollByCard(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.nav-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      menuBtn.textContent = mobileMenu.classList.contains('open') ? 'Cerrar' : 'Menú';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.textContent = 'Menú';
    }));
  }

}
