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

  // ============================================
  // STAT COUNT-UP ANIMATION
  // ============================================
  var statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    var statNumbers = statsSection.querySelectorAll('.stat-number[data-count]');
    var hasAnimated = false;

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateCount(el) {
      var target = parseInt(el.dataset.count, 10);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var easedProgress = easeOutQuad(progress);
        var current = Math.floor(easedProgress * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach(function (el) {
            animateCount(el);
          });
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // ============================================
  // FADE-UP SCROLL ANIMATIONS
  // ============================================
  var animateContainers = document.querySelectorAll('[data-animate]');
  if (animateContainers.length) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.fade-up').forEach(function (el) {
            el.classList.add('is-visible');
          });
          if (entry.target.classList.contains('slide-in-left')) {
            entry.target.classList.add('is-visible');
          }
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    animateContainers.forEach(function (container) {
      fadeObserver.observe(container);
    });
  }

  // ============================================
  // BROTHERS SECTION STAGGER ANIMATION
  // ============================================
  var brothersSection = document.getElementById('brothersSection');
  if (brothersSection) {
    var brothersObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stagger-card, .stagger-cta').forEach(function (el) {
            el.classList.add('is-visible');
          });
          brothersObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    brothersObserver.observe(brothersSection);
  }

  // ============================================
  // SELL PAGE — SCROLL ANIMATIONS
  // ============================================
  var sellSections = document.querySelectorAll('#sellStatsSection, #sellComparisonSection');
  if (sellSections.length) {
    var sellObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.sell-stat-block, .sell-compare-card').forEach(function (el) {
            el.classList.add('is-visible');
          });
          sellObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    sellSections.forEach(function (s) { sellObserver.observe(s); });
  }

  // Individual timeline item observer (each triggers on its own)
  var sellTimelineItems = document.querySelectorAll('.sell-timeline-item');
  if (sellTimelineItems.length) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    sellTimelineItems.forEach(function (item) { timelineObserver.observe(item); });
  }

  // ============================================
  // INVESTORS PAGE — SCROLL ANIMATIONS
  // ============================================
  var investorSections = document.querySelectorAll('#typesSection, #ptSection, #dpSection, #sellDpSection');
  if (investorSections.length) {
    var investObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.type-card, .pt-strip, .dp-card').forEach(function (el) {
            el.classList.add('is-visible');
          });
          investObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    investorSections.forEach(function (s) { investObserver.observe(s); });
  }

  // Diamond timeline — individual item observer
  var dtItems = document.querySelectorAll('.dt-item');
  if (dtItems.length) {
    var dtObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          dtObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    dtItems.forEach(function (item) { dtObserver.observe(item); });
  }

  // ============================================
  // CONTACT PAGE — MULTI-STEP FORM
  // ============================================
  var cardForm = document.querySelector('.card-form');
  if (cardForm) {
    var formCurrent = 1;
    var formTotal = 3;
    var progressBar = document.getElementById('progressBar');
    var stepNumEl = document.getElementById('stepNum');
    var formSteps = cardForm.querySelectorAll('.form-step');

    function updateFormProgress() {
      if (progressBar) progressBar.style.width = (formCurrent / formTotal * 100) + '%';
      if (stepNumEl) stepNumEl.textContent = formCurrent;
    }

    function showFormStep(step) {
      formSteps.forEach(function (s) { s.classList.remove('active'); });
      var target = cardForm.querySelector('.form-step[data-step="' + step + '"]');
      if (target) target.classList.add('active');
    }

    cardForm.querySelectorAll('.btn-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (formCurrent >= formTotal) return;
        formCurrent++;
        showFormStep(formCurrent);
        updateFormProgress();
      });
    });

    cardForm.querySelectorAll('.btn-back').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (formCurrent <= 1) return;
        formCurrent--;
        showFormStep(formCurrent);
        updateFormProgress();
      });
    });
  }

  // ============================================
  // SELL PAGE — TESTIMONIAL CAROUSEL
  // ============================================
  var sellCarousel = document.getElementById('sellTestimonialCarousel');
  if (sellCarousel) {
    var sellSlides = sellCarousel.querySelectorAll('.sell-testimonial-slide');
    var sellCounter = sellCarousel.querySelector('.sell-carousel-current');
    var sellCurrent = 0;

    function sellGoToSlide(i) {
      if (i < 0) i = sellSlides.length - 1;
      if (i >= sellSlides.length) i = 0;
      sellSlides[sellCurrent].classList.remove('active');
      sellCurrent = i;
      sellSlides[sellCurrent].classList.add('active');
      if (sellCounter) sellCounter.textContent = String(sellCurrent + 1).padStart(2, '0');
    }

    var sellPrev = document.getElementById('sellPrevBtn');
    var sellNext = document.getElementById('sellNextBtn');
    if (sellPrev) sellPrev.addEventListener('click', function () { sellGoToSlide(sellCurrent - 1); });
    if (sellNext) sellNext.addEventListener('click', function () { sellGoToSlide(sellCurrent + 1); });

    // Swipe support for testimonials
    var sellStartX = 0;
    sellCarousel.addEventListener('touchstart', function (e) { sellStartX = e.touches[0].clientX; });
    sellCarousel.addEventListener('touchend', function (e) {
      var diff = sellStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? sellGoToSlide(sellCurrent + 1) : sellGoToSlide(sellCurrent - 1);
      }
    });
  }

});
