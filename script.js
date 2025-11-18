document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    nav.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const navTarget = document.body.dataset.nav || '';
  document.querySelectorAll('[data-nav-target]').forEach((link) => {
    if (link instanceof HTMLElement && link.dataset.navTarget === navTarget) {
      link.classList.add('active');
    }
  });

  const chapterTarget = document.body.dataset.page || '';
  document.querySelectorAll('[data-chapter-link]').forEach((link) => {
    if (link instanceof HTMLElement && link.dataset.chapterLink === chapterTarget) {
      link.classList.add('current');
    }
  });

  const progressLinks = Array.from(document.querySelectorAll('.progress-link'));
  const sections = progressLinks
    .map((link) => {
      if (!(link instanceof HTMLElement)) return null;
      const targetId = link.dataset.target;
      if (!targetId) return null;
      const targetEl = document.getElementById(targetId);
      return targetEl ? { link, target: targetEl } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sections.forEach(({ link, target }) => {
            if (target === entry.target) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        });
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0.2 }
    );

    sections.forEach(({ target }) => observer.observe(target));
  }

  const progressFill = document.querySelector('.progress-meter-fill');
  const updateMeter = () => {
    if (!progressFill) return;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    progressFill.style.width = `${ratio * 100}%`;
  };

  updateMeter();
  window.addEventListener('scroll', updateMeter, { passive: true });
  window.addEventListener('resize', updateMeter);
});
