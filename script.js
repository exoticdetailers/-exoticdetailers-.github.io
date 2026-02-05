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

  // Lightbox Functionality
  const lightbox = document.getElementById('lightbox');

  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const closeBtn = document.getElementById('lightbox-close'); // Might exist on gallery page template

    let currentIndex = 0;

    const showImage = (index) => {
      if (index < 0) index = galleryItems.length - 1;
      if (index >= galleryItems.length) index = 0;

      currentIndex = index;
      const imgSrc = galleryItems[currentIndex].getAttribute('data-src');
      lightboxImg.src = imgSrc;
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        showImage(index);
        lightbox.classList.add('active');
      });
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
        lightbox.classList.remove('active');
      }
    });

    // Close button (if exists)
    if (closeBtn) {
      closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    // Navigation Buttons
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

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
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
        observer.unobserve(entry.target); // Only animate once
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

    // Adjust before image width to match container for correct masking
    // In a real scenario, we might handle window resize events to keep them synced
    const updateWidth = () => {
      const w = slider.offsetWidth;
      before.querySelector('img').style.width = w + 'px';
    };
    window.addEventListener('resize', updateWidth);

    // Ensure accurate width calculation after all assets load
    window.addEventListener('load', updateWidth);

    // Initial call
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
