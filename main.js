/* ============================================================
   RESTAURANT ATHOS – Main JavaScript
   ============================================================ */
(function () {
  'use strict';

  /* ── STICKY HEADER ──────────────────────────────────────── */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      header.classList.remove('hero-top');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('hero-top');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── MOBILE NAVIGATION ──────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-nav-cta');

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      this.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });
    mobileLinks.forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── HERO SLIDESHOW ─────────────────────────────────────── */
  var slides = document.querySelectorAll('.hero-slide');
  var currentSlide = 0;
  function showSlide(index) {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  if (slides.length > 1) { showSlide(0); setInterval(nextSlide, 5500); }
  else if (slides.length === 1) { slides[0].classList.add('active'); }

  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  var revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ── FAQ ACCORDION ──────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        var btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── GALLERY LIGHTBOX ───────────────────────────────────── */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox     = document.getElementById('lightbox');
  var lightboxImg  = document.getElementById('lightbox-img');
  var lightboxClose= document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src; lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 400);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox(); });

  /* ── CONTACT FORM ───────────────────────────────────────── */
  var contactForm    = document.getElementById('contact-form');
  var cformSuccess   = document.getElementById('cform-success');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('.cform-submit');
      btn.textContent = 'Wird gesendet…';
      btn.disabled = true;
      setTimeout(function () {
        contactForm.style.display = 'none';
        if (cformSuccess) cformSuccess.classList.add('visible');
      }, 1200);
    });
  }

  /* ── MENU TABS (speisekarte.html) ───────────────────────── */
  var menuTabs     = document.querySelectorAll('.menu-tab');
  var menuSections = document.querySelectorAll('.menu-section');
  if (menuTabs.length && menuSections.length) {
    menuTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        menuTabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        var target = document.getElementById(this.dataset.target);
        if (target) {
          var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 80, behavior: 'smooth' });
        }
      });
    });
    if ('IntersectionObserver' in window) {
      var tabObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            menuTabs.forEach(function (tab) { tab.classList.toggle('active', tab.dataset.target === id); });
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      menuSections.forEach(function (s) { tabObserver.observe(s); });
    }
  }
})();
