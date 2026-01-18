/* =============================================
   SKILL ELGE Website - JavaScript
   NMIMS Hyderabad Campus
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initModernNavbar();
    initScrollAnimations();
    initSmoothScroll();
    initBackToTop();
    initFormHandling();
    initScrollReveal();
});

/* =============================================
   MODERN NAVBAR WITH GSAP ANIMATION
   ============================================= */
function initModernNavbar() {
    const navElement = document.querySelector(".modern-nav");
    if (!navElement) return;

    const activeElement = document.createElement("div");
    activeElement.classList.add("active-element");

    const getOffsetLeft = (element) => {
        const elementRect = element.getBoundingClientRect();
        return (
            elementRect.left -
            navElement.getBoundingClientRect().left +
            (elementRect.width - activeElement.offsetWidth) / 2
        );
    };

    navElement.appendChild(activeElement);
    const activeButton = navElement.querySelector("ul li.active button");

    // Wait for fonts to load then show active element
    document.fonts.ready.then(() => {
        if (typeof gsap !== 'undefined') {
            gsap.set(activeElement, { x: getOffsetLeft(activeButton) });
            gsap.to(activeElement, { "--active-element-show": "1", duration: 0.2 });
        }
    });

    // Handle button clicks
    navElement.querySelectorAll("ul li button").forEach((button, index) => {
        button.addEventListener("click", () => {
            const active = navElement.querySelector("ul li.active");
            const oldIndex = [...active.parentElement.children].indexOf(active);

            if (index === oldIndex || navElement.classList.contains("before") || navElement.classList.contains("after")) {
                return;
            }

            const x = getOffsetLeft(button);
            const direction = index > oldIndex ? "after" : "before";
            const spacing = Math.abs(x - getOffsetLeft(active));

            navElement.classList.add(direction);
            active.classList.remove("active");
            button.parentElement.classList.add("active");

            if (typeof gsap !== 'undefined') {
                gsap.set(activeElement, { rotateY: direction === "before" ? "180deg" : "0deg" });

                gsap.to(activeElement, {
                    keyframes: [
                        {
                            "--active-element-width": `${spacing > navElement.offsetWidth - 60 ? navElement.offsetWidth - 60 : spacing}px`,
                            duration: 0.3,
                            ease: "none",
                            onStart: () => {
                                createSVG(activeElement);
                                gsap.to(activeElement, { "--active-element-opacity": 1, duration: 0.1 });
                            },
                        },
                        {
                            "--active-element-scale-x": "0",
                            "--active-element-scale-y": ".25",
                            "--active-element-width": "0px",
                            duration: 0.3,
                            onStart: () => {
                                gsap.to(activeElement, { "--active-element-mask-position": "40%", duration: 0.5 });
                                gsap.to(activeElement, { "--active-element-opacity": 0, delay: 0.45, duration: 0.25 });
                            },
                            onComplete: () => {
                                activeElement.innerHTML = "";
                                navElement.classList.remove("before", "after");
                                activeElement.removeAttribute("style");
                                gsap.set(activeElement, { x: getOffsetLeft(button), "--active-element-show": "1" });
                            },
                        },
                    ],
                });

                gsap.to(activeElement, { x, "--active-element-strike-x": "-50%", duration: 0.6, ease: "none" });
            }

            // Smooth scroll to section
            const sectionId = button.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                const headerOffset = 100;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav on scroll
    updateActiveNavOnScroll(navElement, activeElement, getOffsetLeft);
}

function updateActiveNavOnScroll(navElement, activeElement, getOffsetLeft) {
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        const buttons = navElement.querySelectorAll("ul li button");
        buttons.forEach(button => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId === current) {
                const currentActive = navElement.querySelector("ul li.active");
                if (currentActive && currentActive !== button.parentElement) {
                    currentActive.classList.remove("active");
                    button.parentElement.classList.add("active");

                    if (typeof gsap !== 'undefined') {
                        gsap.to(activeElement, { x: getOffsetLeft(button), duration: 0.3, ease: "power2.out" });
                    }
                }
            }
        });
    });
}

function createSVG(element) {
    element.innerHTML = `
<svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam">
    <path
        d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z"
        fill="url(#gradient-beam)" />
    <defs>
        <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6495ED" />
            <stop offset="1" stop-color="white" />
        </linearGradient>
    </defs>
</svg>
<div class="strike">
    <svg viewBox="0 0 114 12" preserveAspectRatio="none">
        <g fill="none" stroke="white" stroke-width="0.75" stroke-linecap="round">
            <path
                d="M113.5 6.5L109.068 8.9621C109.023 8.98721 108.974 9.00516 108.923 9.01531L106.889 9.42219C106.661 9.46776 106.432 9.35034 106.336 9.1388L104.045 4.0986C104.015 4.03362 104 3.96307 104 3.8917V2.12268C104 1.6898 103.487 1.46145 103.166 1.75103L99.2887 5.24019C99.1188 5.39305 98.867 5.41132 98.6768 5.28457L95.0699 2.87996C94.7881 2.69205 94.4049 2.83291 94.3118 3.15862L92.6148 9.09827C92.5483 9.33084 92.3249 9.48249 92.0843 9.45843L87.7087 9.02087C87.5752 9.00752 87.4419 9.04839 87.3389 9.13428L84.9485 11.1263C84.7128 11.3227 84.3575 11.2625 84.1996 10.9994L81.7602 6.93359C81.617 6.69492 81.3064 6.61913 81.0694 6.76501L75.3165 10.3052C75.1286 10.4209 74.8871 10.3997 74.7223 10.2531L70.6678 6.64917C70.5611 6.55429 70.5 6.41829 70.5 6.27547V1.20711C70.5 1.0745 70.4473 0.947322 70.3536 0.853553L70.2185 0.718508C70.0846 0.584592 69.8865 0.537831 69.7068 0.59772L69.2675 0.744166C68.9149 0.861705 68.8092 1.30924 69.0721 1.57206L69.605 2.10499C69.8157 2.31571 69.7965 2.66281 69.5638 2.84897L67.5 4.5L65.2715 6.28282C65.1083 6.41338 64.8811 6.42866 64.7019 6.32113L60.3621 3.71725C60.153 3.59179 59.8839 3.63546 59.7252 3.8206L57.0401 6.95327C57.0135 6.9843 56.9908 7.01849 56.9725 7.05505L55.2533 10.4934C55.1188 10.7624 54.779 10.8526 54.5287 10.6858L50.7686 8.17907C50.6051 8.07006 50.3929 8.06694 50.2263 8.17109L46.7094 10.3691C46.5774 10.4516 46.4145 10.468 46.2688 10.4133L42.6586 9.05949C42.5558 9.02091 42.4684 8.94951 42.4102 8.85633L40.1248 5.1997C40.0458 5.07323 40.0273 4.91808 40.0745 4.77659L40.6374 3.08777C40.7755 2.67359 40.3536 2.29381 39.9562 2.47447L35.5 4.5L32.2657 5.88613C32.1013 5.95658 31.9118 5.93386 31.7687 5.82656L30.1904 4.64279C30.0699 4.55245 29.9152 4.5212 29.7691 4.55772L26.2009 5.44977C26.0723 5.48193 25.9617 5.56388 25.8934 5.67759L23.1949 10.1752C23.0796 10.3673 22.8507 10.4593 22.6346 10.4003L17.6887 9.05148C17.5674 9.01838 17.463 8.94076 17.3963 8.83409L15.3331 5.53299C15.1627 5.26032 14.7829 5.21707 14.5556 5.44443L12.1464 7.85355C12.0527 7.94732 11.9255 8 11.7929 8H8.15139C8.05268 8 7.95617 7.97078 7.87404 7.91603L3.74143 5.16095C3.59214 5.06142 3.40096 5.04952 3.24047 5.12976L0.5 6.5" />
        </g>
    </svg>
</div>
`;
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}



/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.offering-card, .event-card, .team-card, .about-card, .feature-item'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/* =============================================
   SCROLL REVEAL ANIMATIONS
   ============================================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .about-text, .about-visual, .contact-info, .contact-form-wrapper');

    const revealOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });

    // Add CSS for revealed state
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* =============================================
   BACK TO TOP BUTTON
   ============================================= */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* =============================================
   FORM HANDLING
   ============================================= */
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input').value;

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            showNotification('Thank you for subscribing!', 'success');
            this.reset();
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    const styles = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: transform 0.3s ease;
    `;
    notification.style.cssText = styles;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/* =============================================
   PARALLAX EFFECT FOR HERO SHAPES
   ============================================= */
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 15;
        const x = (mouseX * speed) - (speed / 2);
        const y = (mouseY * speed) - (speed / 2);

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/* =============================================
   TYPING EFFECT FOR HERO (Optional Enhancement)
   ============================================= */
function initTypingEffect() {
    const element = document.querySelector('.hero-title');
    if (!element) return;

    // This is reserved for future enhancement
    // Can add typing animation if needed
}

/* =============================================
   PRELOADER (Optional)
   ============================================= */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Optional: Hide preloader if added
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

/* =============================================
   KEYBOARD NAVIGATION SUPPORT
   ============================================= */
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

/* =============================================
   LAZY LOADING IMAGES (Performance Enhancement)
   ============================================= */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images have data-src
document.addEventListener('DOMContentLoaded', initLazyLoading);

/* =============================================
   EVENT MODAL FUNCTIONS
   ============================================= */
function openEventModal(eventId) {
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const eventDetails = document.getElementById(eventId + '-details');
    
    if (modal && modalBody && eventDetails) {
        modalBody.innerHTML = eventDetails.innerHTML;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('event-modal');
    if (e.target === modal) {
        closeEventModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEventModal();
    }
});
