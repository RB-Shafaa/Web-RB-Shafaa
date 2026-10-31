(function () {
  'use strict';

  function setFooterYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  function bindMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (!navToggle || !navLinks) return;

    const setNavState = (isOpen) => {
      navToggle.classList.toggle('is-active', isOpen);
      navLinks.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    const closeNav = () => setNavState(false);

    navToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = !navLinks.classList.contains('is-active');
      setNavState(isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeNav());
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      const clickedInsideNav = navToggle.contains(target) || navLinks.contains(target);
      if (!clickedInsideNav && navLinks.classList.contains('is-active')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('is-active')) {
        closeNav();
      }
    });
  }

  function bindModal() {
    const platformModal = document.getElementById('platformModal');
    if (!platformModal) return;

    const closeModal = () => {
      platformModal.classList.remove('is-open');
    };

    const openModalBtn = document.getElementById('openModalBtn');
    if (openModalBtn) {
      openModalBtn.addEventListener('click', (event) => {
        event.preventDefault();
        platformModal.classList.add('is-open');
      });
    }

    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    platformModal.addEventListener('click', (event) => {
      if (event.target === platformModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  function bindEmptyModalLinks() {
    const modalLinks = document.querySelectorAll('.modal-options a');
    modalLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.trim() === '' || href.startsWith('javascript:')) {
          event.preventDefault();
          window.alert('Maaf, tautan atau form ini belum tersedia atau masih kosong.');
        }
      });
    });
  }

  function initArticleGlobal() {
    setFooterYear();
    bindMobileNav();
    bindModal();
    bindEmptyModalLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticleGlobal, { once: true });
  } else {
    initArticleGlobal();
  }
})();
