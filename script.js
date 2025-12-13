document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainNav');

  if (navToggle && nav) {
    const navLinks = nav.querySelectorAll('a');

    if (window.bootstrap && typeof bootstrap.Collapse === 'function') {
      const navCollapse = new bootstrap.Collapse(nav, { toggle: false });

      navToggle.addEventListener('click', () => {
        const isShown = nav.classList.contains('show');
        if (isShown) {
          navCollapse.hide();
        } else {
          navCollapse.show();
        }
        navToggle.setAttribute('aria-expanded', (!isShown).toString());
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('show')) {
            navCollapse.hide();
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    } else {
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

  const sidebar = document.querySelector('.chapter-sidebar');
  if (sidebar instanceof HTMLElement) {
    const sidebarScrollKey = 'chapterSidebarScroll';
    const savedScroll = Number(localStorage.getItem(sidebarScrollKey));
    if (!Number.isNaN(savedScroll)) {
      sidebar.scrollTop = savedScroll;
    }

    let scrollSaveHandle = null;
    const persistSidebarScroll = () => {
      scrollSaveHandle = null;
      try {
        localStorage.setItem(sidebarScrollKey, sidebar.scrollTop.toString());
      } catch (error) {
        /* ignore persistence errors */
      }
    };

    sidebar.addEventListener('scroll', () => {
      if (scrollSaveHandle) return;
      scrollSaveHandle = window.requestAnimationFrame(persistSidebarScroll);
    });

    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        persistSidebarScroll();
      });
    });

    window.addEventListener('beforeunload', persistSidebarScroll);
  }

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
    const headerOffset = 140;

    const setActiveLink = (activeTarget) => {
      sections.forEach(({ link, target }) => {
        link.classList.toggle('is-active', target === activeTarget);
      });
    };

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + headerOffset;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveLink(sections[sections.length - 1].target);
        return;
      }

      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const { target } = sections[i];
        if (scrollPosition >= target.offsetTop) {
          setActiveLink(target);
          return;
        }
      }

      setActiveLink(sections[0].target);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
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
