/* ============================================
   MAIN.JS — Shared JavaScript
   ============================================
   
   Currently includes:
   - Mobile navigation menu toggle
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var navToggle = document.querySelector('.navbar-toggle');
  var navLinks = document.querySelector('.navbar-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      var isOpen = navLinks.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a:not(.nav-dropdown-toggle)').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggle.closest('.nav-dropdown').classList.toggle('is-open');
      }
    });
  });

  // ============================================
  // IMAGE CAROUSEL
  // ============================================
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var countEl = carousel.querySelector('.image-count span');
    var total = slides.length;
    var current = 0;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
      if (countEl) countEl.textContent = (current + 1) + ' / ' + total;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    // Swipe support
    var startX = 0;
    carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
      }
    });
  });

  // ============================================
  // VIDEO PLAY (Click-to-load YouTube)
  // ============================================
  var videoPlaceholder = document.getElementById('videoPlaceholder');
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', function () {
      var embed = document.getElementById('videoEmbed');
      var iframe = embed.querySelector('iframe');
      if (iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
      }
      videoPlaceholder.style.display = 'none';
      embed.style.display = 'block';
    });
  }

});
