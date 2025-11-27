/* ============================================
   SARDIUS GROUP ESTATE - Main JavaScript
   Handles interactivity: mobile menu, accordion, animations
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initAccordion();
  initScrollAnimations();
  initHeaderScroll();
  initSmoothScroll();
});

/* --- Mobile Menu Toggle --- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.nav__mobile');
  const body = document.body;
  
  if (!toggle || !mobileNav) return;
  
  // Toggle mobile menu on button click
  toggle.addEventListener('click', function() {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking on a link
  const mobileLinks = mobileNav.querySelectorAll('.nav__mobile-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('menu-open');
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });
}

/* --- FAQ Accordion --- */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion__item');
  
  if (!accordionItems.length) return;
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    
    header.addEventListener('click', function() {
      // Check if this item is already active
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
  // Select all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  if (!animatedElements.length) return;
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Add visible class when element enters viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,           // Use viewport as root
    threshold: 0.1,       // Trigger when 10% visible
    rootMargin: '0px 0px -50px 0px'  // Slightly before element enters viewport
  });
  
  // Observe all animated elements
  animatedElements.forEach(el => observer.observe(el));
}

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Optional: Hide/show header on scroll direction
    // Uncomment below for hide-on-scroll-down behavior
    /*
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
    */
  });
}

/* --- Smooth Scroll for Anchor Links --- */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed header
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --- Utility: Debounce Function --- */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* --- Utility: Throttle Function --- */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* --- Form Validation (for contact forms) --- */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    // Remove previous error states
    field.classList.remove('error');
    
    // Check if field is empty
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        field.classList.add('error');
        isValid = false;
      }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && field.value) {
      const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
      if (!phoneRegex.test(field.value)) {
        field.classList.add('error');
        isValid = false;
      }
    }
  });
  
  return isValid;
}

/* --- Testimonial Slider (if needed) --- */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.testimonial-slide');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  const dots = slider.querySelectorAll('.slider-dot');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  function showSlide(index) {
    // Wrap around
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    currentSlide = index;
    
    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
  
  // Auto-advance (optional)
  setInterval(() => showSlide(currentSlide + 1), 5000);
}

/* --- Number Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-item__number[data-count]');
  
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

/* --- Lazy Load Images --- */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (!lazyImages.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* --- Back to Top Button --- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', throttle(function() {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, 100));
  
  // Scroll to top on click
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- Exit Intent Popup --- */
function initExitPopup() {
  const popup = document.querySelector('.exit-popup');
  const closeBtn = popup?.querySelector('.exit-popup__close');
  
  if (!popup) return;
  
  let shown = false;
  
  // Show popup when mouse leaves viewport from top
  document.addEventListener('mouseout', function(e) {
    if (e.clientY < 0 && !shown && !sessionStorage.getItem('exitPopupShown')) {
      popup.classList.add('active');
      shown = true;
      sessionStorage.setItem('exitPopupShown', 'true');
    }
  });
  
  // Close popup
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      popup.classList.remove('active');
    });
  }
  
  // Close on background click
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      popup.classList.remove('active');
    }
  });
}

// Initialize optional features
document.addEventListener('DOMContentLoaded', function() {
  initCounterAnimation();
  initLazyLoad();
  initBackToTop();
});

