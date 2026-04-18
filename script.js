document.addEventListener('DOMContentLoaded', () => {

  // --- RENDER CONTENT FROM content.js ---
  if (window.siteContent) {
    const content = window.siteContent;

    // 1. Render Pricing
    const pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer && content.pricing) {
      pricingContainer.innerHTML = content.pricing.packages.map(pkg => `
            <div class="price-card ${pkg.popular ? 'popular' : ''}">
                ${pkg.popular ? '<div class="pop-tag">Most Popular</div>' : ''}
                <h3>${pkg.name}</h3>
                <div class="price">${pkg.price}</div>
                <ul class="features">
                    ${pkg.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 2. Render Add-ons
    const addonsContainer = document.getElementById('addons-container');
    if (addonsContainer && content.pricing.addons) {
      addonsContainer.innerHTML = content.pricing.addons.map(addon => `
            <div class="addon-card">
                <div class="addon-icon"><i class="fa-solid ${addon.icon}"></i></div>
                <div class="addon-info">
                    <h4>${addon.name}</h4>
                    <p>${addon.desc}</p>
                </div>
                <div class="addon-price">${addon.price} <span style="font-size: 0.8rem; font-weight: 400;">${addon.unit}</span></div>
            </div>
        `).join('');
    }

    // 3. Render Reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && content.reviews) {
      reviewsContainer.innerHTML = content.reviews.map(review => `
            <div class="review-card">
                <div class="stars">${'★'.repeat(review.stars)}</div>
                <p class="quote">"${review.text}"</p>
                <div class="reviewer">
                    <span>${review.author}</span>
                    <span>${review.service}</span>
                </div>
            </div>
        `).join('');
    }

    // 4. Render Team
    const teamContainer = document.getElementById('team-container');
    if (teamContainer && content.team) {
      teamContainer.innerHTML = content.team.map(member => {
        const firstName = member.name.split(' ')[0].toLowerCase();
        return `
            <div class="team-card">
                <img src="${member.image}" alt="${member.name}" id="${firstName}-profile" class="team-img" loading="lazy">
                <div class="team-info">
                    <h3>${member.name}</h3>
                    <p>${member.bio}</p>
                    <div class="team-tags">
                        ${member.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
      }).join('');
    }
  }


  // --- MARQUEE CAROUSEL SETUP ---
  // Duplicate each track's children so the CSS translateX(-50%) animation loops seamlessly.
  // Also pauses animation when offscreen (saves CPU/battery and lowers paint cost).
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  marqueeTracks.forEach(track => {
    // Clone each child once. The CSS keyframe translates by -50% of the track width,
    // which matches exactly one full set of the original items.
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Clones should not be focusable/navigable in the lightbox — we tag them
      // so the lightbox click handler can build a deduped list from originals only.
      clone.dataset.clone = 'true';
      track.appendChild(clone);
    });
  });

  // Pause marquee animations when not in viewport (performance win on long pages)
  const marquees = document.querySelectorAll('.marquee');
  if ('IntersectionObserver' in window && marquees.length) {
    const marqueeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const track = entry.target.querySelector('.marquee-track');
        if (!track) return;
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0 });

    marquees.forEach(m => marqueeObserver.observe(m));
  }


  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileBtn && mobileMenu) {
    const menuLinks = mobileMenu.querySelectorAll('a');

    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- LIGHTBOX (supports both .gallery-item and .marquee-item) ---
  const lightbox = document.getElementById('lightbox');

  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const closeBtn = document.getElementById('lightbox-close');

    // Build deduped source list: skip cloned marquee items so left/right nav
    // doesn't feel repetitive.
    const allItems = Array.from(document.querySelectorAll('.gallery-item, .marquee-item'));
    const sourceList = [];
    const seen = new Set();
    allItems.forEach(item => {
      if (item.dataset.clone === 'true') return;
      const src = item.getAttribute('data-src');
      if (src && !seen.has(src)) {
        seen.add(src);
        sourceList.push(src);
      }
    });

    let currentIndex = 0;

    const showImage = (index) => {
      if (sourceList.length === 0) return;
      if (index < 0) index = sourceList.length - 1;
      if (index >= sourceList.length) index = 0;
      currentIndex = index;
      lightboxImg.src = sourceList[currentIndex];
    };

    // Click handler: works for clones too (they still open the right image)
    allItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const idx = sourceList.indexOf(src);
        showImage(idx >= 0 ? idx : 0);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Close on background click (but not when clicking the image or nav buttons)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'Escape') closeLightbox();
    });

    // Swipe support for mobile lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showImage(currentIndex - 1);
        else showImage(currentIndex + 1);
      }
    }, { passive: true });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });

  // Before/After Slider Logic
  const slider = document.getElementById('ba-slider');
  if (slider) {
    const before = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let active = false;

    const updateWidth = () => {
      const w = slider.offsetWidth;
      before.querySelector('img').style.width = w + 'px';
    };
    window.addEventListener('resize', updateWidth);
    window.addEventListener('load', updateWidth);
    updateWidth();

    const slide = (x) => {
      let shift = Math.max(0, Math.min(x, slider.offsetWidth));
      before.style.width = shift + 'px';
      handle.style.left = shift + 'px';
    };

    slider.addEventListener('mousedown', (e) => {
      active = true;
      slide(e.pageX - slider.offsetLeft);
    });

    slider.addEventListener('touchstart', (e) => {
      active = true;
      slide(e.touches[0].pageX - slider.offsetLeft);
    });

    window.addEventListener('mouseup', () => active = false);
    window.addEventListener('touchend', () => active = false);

    window.addEventListener('mousemove', (e) => {
      if (!active) return;
      slide(e.pageX - slider.offsetLeft);
    });

    window.addEventListener('touchmove', (e) => {
      if (!active) return;
      slide(e.touches[0].pageX - slider.offsetLeft);
    });
  }
});
