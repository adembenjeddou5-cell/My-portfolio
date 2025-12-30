// Main JavaScript for Adem Benjeddou Portfolio
'use strict';

// ===========================================
// DOM Elements
// ===========================================
const DOM = {
    // Navigation
    themeBtn: document.getElementById('theme-toggle'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navLinks: document.getElementById('navLinks'),
    navLinksAll: document.querySelectorAll('.nav-link'),
    
    // Progress & Back to Top
    progressBar: document.getElementById('progress-bar'),
    backToTopBtn: document.getElementById('backToTop'),
    
    // Forms
    contactForm: document.getElementById('contactForm'),
    
    // Portfolio
    filterBtns: document.querySelectorAll('.filter-btn'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    
    // Skills
    skillBars: document.querySelectorAll('.progress-fill'),
    statsNumbers: document.querySelectorAll('.stat h4'),
    
    // Particles
    particlesCanvas: document.getElementById('particles-canvas')
};

// ===========================================
// Global Variables
// ===========================================
let particles = [];
let animationId = null;
let isScrolling = false;
let scrollTimeout = null;

// ===========================================
// Initialize Application
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized - Adem Benjeddou');
    
    // Initialize all components
    initTheme();
    initParticles();
    initIntersectionObserver();
    initSkillsAnimation();
    initCounterAnimation();
    initPortfolioFilter();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    initTouchOptimizations();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial calculations
    updateActiveNavLink();
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===========================================
// Theme Management
// ===========================================
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-theme');
        updateThemeIcon('sun');
    } else {
        updateThemeIcon('moon');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('portfolio-theme')) {
            if (e.matches) {
                document.body.classList.remove('light-theme');
                updateThemeIcon('moon');
            } else {
                document.body.classList.add('light-theme');
                updateThemeIcon('sun');
            }
        }
    });
}

function updateThemeIcon(icon) {
    const iconElement = DOM.themeBtn.querySelector('i');
    iconElement.className = icon === 'sun' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===========================================
// Particles Animation
// ===========================================
function initParticles() {
    if (!DOM.particlesCanvas) return;
    
    const ctx = DOM.particlesCanvas.getContext('2d');
    const width = DOM.particlesCanvas.width = window.innerWidth;
    const height = DOM.particlesCanvas.height = window.innerHeight;
    
    // Create particles
    const particleCount = Math.min(50, Math.floor(width / 20));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary').trim() || '#00d2ff';
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off walls
            if (particle.x > width) particle.x = 0;
            if (particle.x < 0) particle.x = width;
            if (particle.y > height) particle.y = 0;
            if (particle.y < 0) particle.y = height;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = primaryColor;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = primaryColor;
                    ctx.globalAlpha = 0.1 * (1 - distance / 100);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle resize
    window.addEventListener('resize', function() {
        DOM.particlesCanvas.width = window.innerWidth;
        DOM.particlesCanvas.height = window.innerHeight;
    });
}

// ===========================================
// Intersection Observer for Animations
// ===========================================
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('progress-fill')) {
                    const width = entry.target.getAttribute('data-width');
                    setTimeout(() => {
                        entry.target.style.width = `${width}%`;
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Observe skill bars
    DOM.skillBars.forEach(bar => observer.observe(bar));
    
    // Observe tech items
    document.querySelectorAll('.tech-item').forEach(item => {
        observer.observe(item);
    });
}

// ===========================================
// Skills Animation
// ===========================================
function initSkillsAnimation() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target;
                const width = progressFill.getAttribute('data-width');
                
                // Animate with delay based on index
                const index = Array.from(DOM.skillBars).indexOf(progressFill);
                setTimeout(() => {
                    progressFill.style.width = `${width}%`;
                }, index * 100);
                
                skillObserver.unobserve(progressFill);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    DOM.skillBars.forEach(bar => skillObserver.observe(bar));
}

// ===========================================
// Counter Animation
// ===========================================
function initCounterAnimation() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        element.textContent = target + (element.getAttribute('data-count').includes('100') ? '%' : '+');
                        clearInterval(counter);
                    } else {
                        element.textContent = Math.floor(current) + (element.getAttribute('data-count').includes('100') ? '%' : '+');
                    }
                }, 16);
                
                counterObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    
    DOM.statsNumbers.forEach(number => counterObserver.observe(number));
}

// ===========================================
// Portfolio Filtering
// ===========================================
function initPortfolioFilter() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter portfolio items
            DOM.portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===========================================
// Contact Form
// ===========================================
function initContactForm() {
    if (!DOM.contactForm) return;
    
    DOM.contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };
        
        // Simple validation
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('Please fill in all required fields.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return;
        }
        
        try {
            // In a real application, you would send this to your server
            // For demo purposes, we'll simulate an API call
            await simulateAPICall(formData);
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            DOM.contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Form input validation
    const formInputs = DOM.contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error)';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

async function simulateAPICall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            Math.random() > 0.1 ? resolve(data) : reject(new Error('Network error'));
        }, 1500);
    });
}

// ===========================================
// Mobile Menu
// ===========================================
function initMobileMenu() {
    DOM.mobileMenuBtn.addEventListener('click', function() {
        DOM.navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Toggle body scroll
        document.body.style.overflow = DOM.navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    DOM.navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            DOM.navLinks.classList.remove('active');
            DOM.mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!DOM.mobileMenuBtn.contains(event.target) && 
            !DOM.navLinks.contains(event.target) && 
            DOM.navLinks.classList.contains('active')) {
            DOM.navLinks.classList.remove('active');
            DOM.mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    });
}

// ===========================================
// Scroll Animations
// ===========================================
function initScrollAnimations() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        // Progress bar
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        if (DOM.progressBar) {
            DOM.progressBar.style.width = `${scrollPercent}%`;
        }
        
        // Back to top button
        if (DOM.backToTopBtn) {
            if (scrollTop > 500) {
                DOM.backToTopBtn.classList.add('visible');
            } else {
                DOM.backToTopBtn.classList.remove('visible');
            }
        }
        
        // Navbar background on scroll
        if (scrollTop > 100) {
            document.querySelector('.navbar').style.background = 'rgba(5, 7, 10, 0.95)';
            if (document.body.classList.contains('light-theme')) {
                document.querySelector('.navbar').style.background = 'rgba(248, 250, 252, 0.95)';
            }
        } else {
            document.querySelector('.navbar').style.background = '';
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        // Parallax effect for blobs
        const blobs = document.querySelectorAll('.blob, .blob2');
        blobs.forEach(blob => {
            const speed = blob.classList.contains('blob') ? 0.2 : 0.1;
            const yPos = -(scrollTop * speed);
            blob.style.transform = `translateY(${yPos}px)`;
        });
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    if (DOM.backToTopBtn) {
        DOM.backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function updateActiveNavLink() {
    const scrollPos = window.pageYOffset + 100;
    const sections = document.querySelectorAll('section[id], header[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            DOM.navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===========================================
// Touch Device Optimizations
// ===========================================
function initTouchOptimizations() {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to buttons
        const interactiveElements = document.querySelectorAll('button, .btn-primary, .btn-secondary, .tech-item, .portfolio-item');
        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
}

// ===========================================
// Notification System
// ===========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// ===========================================
// Event Listeners Setup
// ===========================================
function setupEventListeners() {
    // Theme toggle
    DOM.themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', theme);
        
        const icon = this.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Update particles color
        if (animationId) {
            cancelAnimationFrame(animationId);
            initParticles();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape closes mobile menu and modals
        if (e.key === 'Escape') {
            if (DOM.navLinks.classList.contains('active')) {
                DOM.navLinks.classList.remove('active');
                DOM.mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        }
        
        // Theme toggle with Ctrl/Cmd + T
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            DOM.themeBtn.click();
        }
    });
    
    // Prevent form submission on Enter in search/email fields
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
    
    // Performance optimization for scroll events
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 100);
        }
    });
    
    // Handle page visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            // Resume animations
            if (!animationId && DOM.particlesCanvas) {
                initParticles();
            }
        }
    });
    
    // Form submission prevention for demo
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id !== 'contactForm') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('This is a demo form. In a real application, this would submit data.', 'info');
            });
        }
    });
}

// ===========================================
// Performance Optimizations
// ===========================================
// Debounce function for resize events
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

// Throttle function for scroll events
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

// ===========================================
// Cleanup on Page Unload
// ===========================================
window.addEventListener('beforeunload', function() {
    // Clean up animations
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Remove event listeners
    const events = ['scroll', 'resize', 'click'];
    events.forEach(event => {
        window.removeEventListener(event, () => {});
    });
});

// ===========================================
// Export for debugging (optional)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTheme,
        showNotification,
        updateActiveNavLink
    };
}

// Console greeting
console.log('%c👋 Hello! Thanks for checking out my portfolio.', 
    'color: #00d2ff; font-size: 16px; font-weight: bold;');
console.log('%c🔧 Built with modern JavaScript and CSS3', 
    'color: #3a7bd5; font-size: 14px;');