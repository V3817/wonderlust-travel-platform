// ========== HOME PAGE FUNCTIONALITY ==========

// Background image rotation for hero section
const homePageInit = () => {
  const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1526779259212-756e5cdb5f9e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&q=80"
  ];

  let index = 0;
  const hero = document.getElementById("hero-section");

  if (hero) {
    function setBackground() {
      hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${images[index]}')`;
      index = (index + 1) % images.length;
    }

    setBackground();
    setInterval(setBackground, 6000);
  }
};

// Create floating particles
const createParticles = () => {
  const container = document.getElementById('particles-container');
  if (container) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 4 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 6 + 's';
      container.appendChild(particle);
    }
  }
};

// Live search functionality
const initLiveSearch = () => {
  const liveSearch = document.getElementById('liveSearch');
  const searchSuggestions = document.getElementById('searchSuggestions');

  if (!liveSearch) {
    console.log('Live search input not found');
    return;
  }

  if (!searchSuggestions) {
    console.log('Search suggestions container not found');
    return;
  }

  const popularDestinations = [
    'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK',
    'Mumbai, India', 'Dubai, UAE', 'Singapore', 'Barcelona, Spain',
    'Sydney, Australia', 'Bangkok, Thailand', 'Goa, India', 'Bali, Indonesia'
  ];

  liveSearch.addEventListener('input', (e) => {
    try {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length > 0) {
        const filtered = popularDestinations.filter(dest => 
          dest.toLowerCase().includes(query)
        );
        
        if (filtered.length > 0) {
          searchSuggestions.innerHTML = filtered.map(dest => 
            `<div class="suggestion-item" role="button" tabindex="0">${dest}</div>`
          ).join('');
          searchSuggestions.style.display = 'block';
        } else {
          searchSuggestions.innerHTML = '<div class="suggestion-item">No suggestions found</div>';
          searchSuggestions.style.display = 'block';
        }
      } else {
        searchSuggestions.style.display = 'none';
      }
    } catch (error) {
      console.error('Search input error:', error);
      searchSuggestions.style.display = 'none';
    }
  });

  // Handle suggestion clicks and keyboard navigation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item') && e.target.textContent !== 'No suggestions found') {
      liveSearch.value = e.target.textContent;
      searchSuggestions.style.display = 'none';
    } else if (!e.target.closest('.search-preview-container')) {
      searchSuggestions.style.display = 'none';
    }
  });

  // Handle keyboard navigation for suggestions
  liveSearch.addEventListener('keydown', (e) => {
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
    if (suggestions.length === 0) return;

    let currentIndex = Array.from(suggestions).findIndex(item => item.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
    } else if (e.key === 'Enter' && currentIndex >= 0) {
      e.preventDefault();
      liveSearch.value = suggestions[currentIndex].textContent;
      searchSuggestions.style.display = 'none';
      return;
    }

    // Update active suggestion
    suggestions.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });
  });
};

// Live weather widget
const updateWeather = async () => {
  try {
    const tempElement = document.getElementById('currentTemp');
    const locationElement = document.getElementById('currentLocation');
    
    if (!tempElement || !locationElement) {
      console.log('Weather widget elements not found');
      return;
    }

    // Simulated weather data (replace with real API if needed)
    const weatherData = {
      temp: Math.floor(Math.random() * 15) + 20,
      location: 'Your Location',
      icon: 'bi-sun'
    };
    
    tempElement.textContent = `${weatherData.temp}°C`;
    locationElement.textContent = weatherData.location;
    
    // Update weather icon based on temperature
    const weatherIcon = document.querySelector('.weather-icon');
    if (weatherIcon) {
      weatherIcon.className = 'bi weather-icon me-2';
      if (weatherData.temp > 30) {
        weatherIcon.classList.add('bi-sun');
      } else if (weatherData.temp > 20) {
        weatherIcon.classList.add('bi-cloud-sun');
      } else {
        weatherIcon.classList.add('bi-cloud');
      }
    }
    
  } catch (error) {
    console.error('Weather update error:', error);
    const tempElement = document.getElementById('currentTemp');
    const locationElement = document.getElementById('currentLocation');
    
    if (tempElement) tempElement.textContent = '--°C';
    if (locationElement) locationElement.textContent = 'Unavailable';
  }
};

// Number animation function
const animateNumber = (element, start, end, duration) => {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
};

// Live statistics updates
const updateLiveStats = () => {
  const stats = {
    activeUsers: Math.floor(Math.random() * 50) + 200,
    newListings: Math.floor(Math.random() * 5) + 10,
    reviewsToday: Math.floor(Math.random() * 20) + 70,
    bookingsToday: Math.floor(Math.random() * 30) + 140
  };
  
  Object.keys(stats).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      animateNumber(element, parseInt(element.textContent) || 0, stats[key], 1000);
    }
  });
};

// Counter animation for main stats
const animateCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  
  if (counters.length === 0) {
    console.log('No counter elements found');
    return;
  }

  counters.forEach(counter => {
    try {
      const target = parseInt(counter.getAttribute('data-count'));
      if (isNaN(target)) {
        console.warn('Invalid data-count value:', counter.getAttribute('data-count'));
        return;
      }

      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + (target === 98 ? '%' : '+');
      }, 16);
    } catch (error) {
      console.error('Error animating counter:', error);
    }
  });
};

// Intersection Observer for counters
const initCounterObserver = () => {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.querySelector('.bg-primary');
  if (statsSection) {
    observer.observe(statsSection);
  }
};

// Interactive map hotspots
const initInteractiveMap = () => {
  const hotspots = document.querySelectorAll('.hotspot');
  if (hotspots.length === 0) {
    console.log('No hotspots found on page');
    return;
  }

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      try {
        const city = hotspot.dataset.city;
        const listings = hotspot.dataset.listings;
        const country = hotspot.dataset.country || '';
        
        // Create enhanced ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,71,87,0.6) 50%, transparent 100%);
          animation: enhanced-ripple 1.2s ease-out;
          pointer-events: none;
          z-index: 100;
        `;
        
        hotspot.appendChild(ripple);
        
        // Add glow effect to hotspot
        hotspot.style.filter = 'brightness(1.5) drop-shadow(0 0 10px rgba(255,71,87,0.8))';
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.remove();
          }
          hotspot.style.filter = '';
        }, 1200);
        
        // Show enhanced info message
        if (typeof showFlashMessage === 'function') {
          const countryFlag = country === 'France' ? '🇫🇷' : 
                             country === 'Japan' ? '🇯🇵' : 
                             country === 'USA' ? '🇺🇸' : 
                             country === 'India' ? '🇮🇳' : '🌍';
          
          showFlashMessage('info', `Exploring ${countryFlag} ${city}`, 
            `Discovering ${listings} amazing properties in ${city}! Redirecting...`, 2000);
        }
        
        // Redirect to search results for that city
        setTimeout(() => {
          window.location.href = `/listings?search=${encodeURIComponent(city)}`;
        }, 1500);
        
      } catch (error) {
        console.error('Error handling hotspot click:', error);
        if (typeof showFlashMessage === 'function') {
          showFlashMessage('error', 'Error', 'Unable to load destination info.');
        }
      }
    });

    // Add hover effects
    hotspot.addEventListener('mouseenter', () => {
      hotspot.style.filter = 'brightness(1.2) drop-shadow(0 0 8px rgba(255,71,87,0.6))';
    });

    hotspot.addEventListener('mouseleave', () => {
      hotspot.style.filter = '';
    });
  });

  // Add enhanced ripple animation to CSS if not exists
  if (!document.querySelector('#enhanced-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'enhanced-ripple-style';
    style.textContent = `
      @keyframes enhanced-ripple {
        0% {
          width: 10px;
          height: 10px;
          opacity: 1;
        }
        50% {
          width: 60px;
          height: 60px;
          opacity: 0.6;
        }
        100% {
          width: 120px;
          height: 120px;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Smooth scrolling for scroll indicator
const initScrollIndicator = () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const target = document.querySelector('.bg-light');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }
};

// ========== GLOBAL UTILITY FUNCTIONS ==========

// Global utility functions
function showFlashMessage(type, title, message, duration = 5000) {
    const flashContainer = document.getElementById('flashContainer') || document.body;
    const alertId = 'alert-' + Date.now();
    
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 
                     type === 'error' ? 'bi-exclamation-triangle-fill' : 
                     type === 'warning' ? 'bi-exclamation-circle-fill' : 
                     'bi-info-circle-fill';
    
    const alertHTML = `
        <div class="alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show shadow-sm border-0 mx-3 mt-3" 
             role="alert" id="${alertId}">
            <div class="d-flex align-items-center">
                <i class="${iconClass} me-2 fs-5"></i>
                <strong>${title}!</strong> ${message}
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    flashContainer.insertAdjacentHTML('afterbegin', alertHTML);
    
    // Auto-dismiss after specified duration
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert && typeof bootstrap !== 'undefined') {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, duration);
}

// Auto-dismiss server-side alerts
function initializeFlashMessages() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (typeof bootstrap !== 'undefined') {
                const alertInstance = new bootstrap.Alert(alert);
                alertInstance.close();
            }
        }, 5000);
    });
}

// Network status monitoring
function initializeNetworkMonitoring() {
    window.addEventListener('online', () => {
        showFlashMessage('success', 'Connection Restored', 'Your internet connection has been restored.');
    });
    
    window.addEventListener('offline', () => {
        showFlashMessage('error', 'Connection Lost', 'You have lost your internet connection.');
    });
    
    // Initial network check
    if (!navigator.onLine) {
        showFlashMessage('warning', 'Offline Mode', 'You are currently offline.');
    }
}

// Image error handling
function handleImageError(img) {
    const fallbackSrc = 'https://via.placeholder.com/250x250/e9ecef/6c757d?text=Image+Not+Available';
    if (img.src !== fallbackSrc) {
        img.src = fallbackSrc;
        img.alt = 'Image not available';
    }
}

// Initialize image error handlers
function initializeImageHandlers() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
}

// Form validation utilities
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Scroll to first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
            form.classList.add('was-validated');
        });
    });
}

// Password toggle functionality
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle-btn, [id^="togglePassword"], [id^="toggleConfirmPassword"], .toggle-password');
    toggleButtons.forEach(button => {
        if (button.dataset.toggleBound === 'true') return;
        button.dataset.toggleBound = 'true';

        button.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.closest('.input-group') || this.parentElement;
            const passwordInput = parent.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });
}

// Wishlist functionality
function toggleWishlist(button) {
    try {
        const icon = button.querySelector('i');
        const listingTitle = button.closest('.card').querySelector('.card-title')?.textContent || 'Property';
        
        if (icon && icon.classList.contains('bi-heart')) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            button.classList.add('text-danger');
            showFlashMessage('success', 'Added to Wishlist', `"${listingTitle}" has been added to your wishlist.`);
        } else if (icon) {
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            button.classList.remove('text-danger');
            showFlashMessage('info', 'Removed from Wishlist', `"${listingTitle}" has been removed from your wishlist.`);
        }
    } catch (error) {
        showFlashMessage('error', 'Error', 'Unable to update wishlist. Please try again.');
        console.error('Wishlist error:', error);
    }
}

// Enhanced global error handler with better debugging
function initializeErrorHandlers() {
    window.addEventListener('error', function(e) {
        console.error('Global JavaScript error:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error,
            stack: e.error ? e.error.stack : 'No stack trace available'
        });
        
        // Only show flash message for critical errors, not minor ones
        if (e.error && !e.error.name?.includes('NetworkError')) {
            showFlashMessage('error', 'Script Error', `Error in ${e.filename || 'unknown file'}: ${e.message}`);
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', {
            reason: e.reason,
            promise: e.promise,
            stack: e.reason?.stack || 'No stack trace available'
        });
        
        // Only show user-friendly message for promise rejections
        if (e.reason && !e.reason.name?.includes('AbortError')) {
            showFlashMessage('warning', 'Network Issue', 'A network request failed. Please check your connection.');
        }
        
        // Prevent the default browser behavior
        e.preventDefault();
    });
}

// ========== INITIALIZATION ==========

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize home page features
    homePageInit();
    createParticles();
    initLiveSearch();
    updateWeather();
    updateLiveStats();
    initCounterObserver();
    initInteractiveMap();
    initScrollIndicator();
    
    // Initialize common features
    initializeFlashMessages();
    initializeNetworkMonitoring();
    initializeImageHandlers();
    initializeFormValidation();
    initializePasswordToggle();
    initializeErrorHandlers();
    
    // Set up periodic updates for home page
    setInterval(updateLiveStats, 30000); // Update stats every 30 seconds
    setInterval(updateWeather, 300000);  // Update weather every 5 minutes
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

// Make functions globally available for debugging and external use
window.showFlashMessage = showFlashMessage;
window.toggleWishlist = toggleWishlist;
window.homePageInit = homePageInit;
window.createParticles = createParticles;
window.initLiveSearch = initLiveSearch;
window.updateWeather = updateWeather;
window.updateLiveStats = updateLiveStats;
window.initInteractiveMap = initInteractiveMap;
window.initScrollIndicator = initScrollIndicator;

window.updateRating = function(value) {
    const ratingSlider = document.getElementById('ratingSlider');
    if (ratingSlider) {
        ratingSlider.value = value;
        initializeRatingSlider();
    }
};

