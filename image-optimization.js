/* =============================================
   IMAGE OPTIMIZATION - LAZY LOADING DISABLED
   All images will load immediately
   ============================================= */

// Add this to the main DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    initImageOptimization();
    initProgressiveImageLoading();
});

/* =============================================
   IMAGE OPTIMIZATION - EAGER LOADING FOR ALL
   ============================================= */
function initImageOptimization() {
    // Set all images to eager loading (load immediately)
    const allImages = document.querySelectorAll('img');

    allImages.forEach((img, index) => {
        // Remove lazy loading if it exists
        if (img.hasAttribute('loading')) {
            img.removeAttribute('loading');
        }

        // Set to eager loading (load immediately)
        img.setAttribute('loading', 'eager');

        // Add decoding attribute for better performance
        img.setAttribute('decoding', 'async');
    });
}

/* =============================================
   PROGRESSIVE IMAGE LOADING WITH BLUR EFFECT
   ============================================= */
function initProgressiveImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Skip if already loaded
        if (img.complete) {
            img.classList.add('img-loaded');
            return;
        }

        // Add loading class for blur effect
        img.classList.add('img-loading');

        // When image loads, remove loading class and add loaded class
        img.addEventListener('load', function () {
            this.classList.remove('img-loading');
            this.classList.add('img-loaded');
        });

        // Handle error
        img.addEventListener('error', function () {
            this.classList.remove('img-loading');
            this.classList.add('img-error');
            console.warn('Failed to load image:', this.src);
        });
    });
}

/* =============================================
   PRELOAD CRITICAL IMAGES
   ============================================= */
function preloadCriticalImages() {
    const criticalImages = [
        'Images/skill_elge.png.jpeg',
        'Images/nmims_logo.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Preload critical images immediately
preloadCriticalImages();

/* =============================================
   LAZY LOADING DISABLED
   All images load immediately with eager loading
   ============================================= */
// IntersectionObserver code removed - not needed for eager loading

/* =============================================
   RESPONSIVE IMAGE LOADING
   Load appropriate image sizes based on viewport
   ============================================= */
function optimizeImageSizes() {
    const images = document.querySelectorAll('img');
    const viewportWidth = window.innerWidth;

    images.forEach(img => {
        // Add responsive image attributes if not present
        if (!img.hasAttribute('sizes')) {
            // Determine appropriate sizes based on image location
            if (img.closest('.team-card')) {
                img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw');
            } else if (img.closest('.hero-bg-logo, .corner-logo')) {
                img.setAttribute('sizes', '(max-width: 768px) 150px, 200px');
            }
        }
    });
}

// Run on load and resize
window.addEventListener('load', optimizeImageSizes);
window.addEventListener('resize', debounce(optimizeImageSizes, 250));

/* =============================================
   UTILITY: DEBOUNCE FUNCTION
   ============================================= */
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

/* =============================================
   MONITOR PERFORMANCE
   ============================================= */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('Performance Metrics:');
            console.log('Page Load Time:', pageLoadTime + 'ms');
            console.log('Connect Time:', connectTime + 'ms');
            console.log('Render Time:', renderTime + 'ms');

            // Log slow images
            if (window.performance.getEntriesByType) {
                const resources = window.performance.getEntriesByType('resource');
                const slowImages = resources
                    .filter(r => r.initiatorType === 'img' && r.duration > 1000)
                    .sort((a, b) => b.duration - a.duration);

                if (slowImages.length > 0) {
                    console.warn('Slow loading images (>1s):');
                    slowImages.forEach(img => {
                        console.warn(`- ${img.name.split('/').pop()}: ${Math.round(img.duration)}ms`);
                    });
                }
            }
        }, 0);
    });
}
