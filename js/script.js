// ============================================
// DOM READY & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Website CV SR PUSPA JAYA - Initializing...');
    
    // Initialize current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize simple lightbox gallery
    initSimpleLightbox();
    
    // Initialize animations
    initAnimations();
    
    // Initialize scroll margin for sections
    setScrollMargin();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
    
    // Initialize clients slider
    initClientsSlider();
    
    // Initialize custom alerts
    initCustomAlerts();
    
    // Initialize WhatsApp button
    initWhatsAppButton();
    
    // Initialize stats counter
    initStatsCounter();
    
    // Add print button functionality
    initPrintButton();
    
    console.log('Initialization complete!');
});

// ============================================
// SIMPLE LIGHTBOX GALLERY FUNCTIONALITY
// ============================================

let currentImageIndex = 0;
let galleryImages = [];

// Initialize simple lightbox (untuk gallery sederhana)
function initSimpleLightbox() {
    console.log('Initializing Simple Gallery Lightbox...');
    
    // Get all gallery images (class gallery-item img)
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (galleryItems.length === 0) {
        console.warn('No gallery images found. Check if .gallery-item img exists.');
        return;
    }
    
    console.log(`Found ${galleryItems.length} gallery images`);
    
    // Store images in array
    galleryImages = Array.from(galleryItems).map((img, index) => ({
        src: img.src,
        alt: img.alt || `Gambar ${index + 1}`,
        index: index
    }));
    
    // Add click event to each image
    galleryImages.forEach((item, index) => {
        const imgElement = galleryItems[index];
        imgElement.style.cursor = 'pointer';
        
        imgElement.addEventListener('click', function(e) {
            e.preventDefault();
            openSimpleLightbox(index);
        });
    });
    
    // Create lightbox elements
    createSimpleLightboxElements();
}

// Create simple lightbox HTML elements
function createSimpleLightboxElements() {
    // Check if lightbox already exists
    if (document.getElementById('simple-lightbox')) return;
    
    console.log('Creating Simple Lightbox Elements...');
    
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.id = 'simple-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" onclick="closeSimpleLightbox()">
            <i class="bi bi-x-lg"></i>
        </button>
        <button class="lightbox-prev" onclick="prevSimpleImage()">
            <i class="bi bi-chevron-left"></i>
        </button>
        <div class="lightbox-content">
            <div class="lightbox-counter" id="lightbox-counter">1 / ${galleryImages.length}</div>
            <img id="lightbox-img" src="" alt="">
        </div>
        <button class="lightbox-next" onclick="nextSimpleImage()">
            <i class="bi bi-chevron-right"></i>
        </button>
    `;
    
    document.body.appendChild(lightbox);
}

// Open simple lightbox
function openSimpleLightbox(index = 0) {
    if (galleryImages.length === 0) {
        console.warn('No gallery images found');
        return;
    }
    
    currentImageIndex = index;
    updateSimpleLightbox();
    
    const lightbox = document.getElementById('simple-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleSimpleKeydown);
    
    console.log(`Lightbox opened - Image ${index + 1}/${galleryImages.length}`);
}

// Close simple lightbox
function closeSimpleLightbox() {
    const lightbox = document.getElementById('simple-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    
    // Remove keyboard navigation
    document.removeEventListener('keydown', handleSimpleKeydown);
    
    console.log('Lightbox closed');
}

// Update simple lightbox content
function updateSimpleLightbox() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    if (!lightboxImg || !galleryImages[currentImageIndex]) return;
    
    const image = galleryImages[currentImageIndex];
    
    // Add loading state
    lightboxImg.style.opacity = '0.7';
    
    // Preload image
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxImg.style.opacity = '1';
    };
    
    img.onerror = () => {
        lightboxImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMzAgMjBDMjYuMTM0IDIwIDIzIDIzLjEzNCAyMyAyN0MyMyAzMC44NjYgMjYuMTM0IDM0IDMwIDM0QzMzLjg2NiAzNCAzNyAzMC44NjYgMzcgMjdDMzcgMjMuMTM0IDMzLjg2NiAyMCAzMCAyMFpNMjAgMzJDMjAgMjYuNDc3IDI0LjQ3NyAyMiAzMCAyMkMzNS41MjMgMjIgNDAgMjYuNDc3IDQwIDMyQzQwIDM3LjUyMyAzNS41MjMgNDIgMzAgNDJDMjQuNDc3IDQyIDIwIDM3LjUyMyAyMCAzMlpNMjAgMzVDMTguODk1IDM1IDE4IDM1Ljg5NSAxOCAzN0MxOCAzOC4xMDUgMTguODk1IDM5IDIwIDM5SDQwQzQxLjEwNSAzOSA0MiAzOC4xMDUgNDIgMzdDNDIgMzUuODk1IDQxLjEwNSAzNSA0MCAzNUgyMFoiIGZpbGw9IiNGRjZCNkIiLz48L3N2Zz4=';
        lightboxImg.alt = 'Gambar tidak ditemukan';
        lightboxImg.style.opacity = '1';
    };
    
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

// Navigate to next image
function nextSimpleImage() {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateSimpleLightbox();
}

// Navigate to previous image
function prevSimpleImage() {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateSimpleLightbox();
}

// Handle keyboard navigation for simple lightbox
function handleSimpleKeydown(e) {
    if (galleryImages.length === 0) return;
    
    switch(e.key) {
        case 'Escape':
            closeSimpleLightbox();
            break;
        case 'ArrowRight':
            nextSimpleImage();
            break;
        case 'ArrowLeft':
            prevSimpleImage();
            break;
        case ' ':
            e.preventDefault();
            nextSimpleImage();
            break;
    }
}

// Close lightbox when clicking outside image
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('simple-lightbox');
    if (lightbox && lightbox.classList.contains('active') && e.target === lightbox) {
        closeSimpleLightbox();
    }
});

// ============================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================

function initSmoothScrolling() {
    console.log('Initializing Smooth Scrolling...');
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if target is # or #lightbox or javascript links
            if (targetId === '#' || targetId === '#lightbox' || targetId.startsWith('javascript:')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close navbar collapse on mobile after clicking a link
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) navbarToggler.click();
                }
                
                // Calculate offset based on device
                const offset = window.innerWidth < 768 ? 70 : 80;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
                
                console.log(`Smooth scrolling to: ${targetId}`);
            }
        });
    });
}

// Update active nav link
function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Update active nav link on scroll
function updateActiveNavOnScroll() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    if (current) {
        updateActiveNavLink('#' + current);
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavOnScroll();
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        // Back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    // Add click event to back to top button
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// CONTACT FORM FUNCTIONALITY
// ============================================

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }
    
    console.log('Initializing Contact Form...');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        // Validation flags
        let isValid = true;
        let errorMessage = '';
        
        // Name validation
        if (!name) {
            isValid = false;
            errorMessage = 'Nama lengkap wajib diisi!';
        }
        
        // Phone validation
        if (!phone) {
            isValid = false;
            errorMessage = 'Nomor telepon wajib diisi!';
        } else {
            const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                isValid = false;
                errorMessage = 'Format nomor telepon tidak valid!';
            }
        }
        
        // Email validation
        if (!email) {
            isValid = false;
            errorMessage = 'Email wajib diisi!';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage = 'Format email tidak valid!';
            }
        }
        
        // Subject validation
        if (!subject) {
            isValid = false;
            errorMessage = 'Pilih jenis layanan!';
        }
        
        // Message validation
        if (!message) {
            isValid = false;
            errorMessage = 'Pesan wajib diisi!';
        } else if (message.length < 10) {
            isValid = false;
            errorMessage = 'Pesan terlalu pendek! Minimal 10 karakter.';
        }
        
        if (!isValid) {
            showAlert(errorMessage, 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Halo CV SR PUSPA JAYA,%0A%0A`
            + `Nama: ${name}%0A`
            + `Telepon: ${phone}%0A`
            + `Email: ${email}%0A`
            + `Layanan: ${subject}%0A`
            + `Pesan: ${message}%0A%0A`
            + `Saya ingin berkonsultasi mengenai layanan Anda.`;
        
        // Show success message
        showAlert(`Terima kasih ${name}! Anda akan diarahkan ke WhatsApp untuk melanjutkan konsultasi.`, 'success');
        
        // Add loading state to button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Mengirim...';
        submitButton.disabled = true;
        
        // Open WhatsApp after delay
        setTimeout(() => {
            window.open(`https://wa.me/6281234567890?text=${whatsappMessage}`, '_blank');
            
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Reset form
            contactForm.reset();
            
            // Track form submission
            console.log('Form submitted successfully:', { name, phone, email, subject });
            
        }, 1500);
    });
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate individual form field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            return false;
        }
    }
    
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    return true;
}

// ============================================
// ANIMATIONS & INTERSECTION OBSERVER
// ============================================

function initAnimations() {
    console.log('Initializing Animations...');
    
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animated');
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animate-able elements
    const animateElements = document.querySelectorAll(
        '.service-card, .gallery-item, .testimonial-card, .value-box, .description-card, .client-logo'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    console.log(`Observing ${animateElements.length} elements for animation`);
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================

function initTestimonialsSlider() {
    const testimonialsContainer = document.querySelector('.testimonials-wrapper');
    if (!testimonialsContainer) return;
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;
    
    console.log(`Initializing Testimonials Slider - ${testimonialCards.length} testimonials`);
    
    // Simple auto-rotate testimonials
    let currentTestimonial = 0;
    
    function rotateTestimonials() {
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0.7';
            card.style.transform = 'scale(0.95)';
            
            if (index === currentTestimonial) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }
    
    // Start rotation if on desktop
    if (window.innerWidth > 768) {
        setInterval(rotateTestimonials, 5000);
    }
}

// ============================================
// CLIENTS SLIDER
// ============================================

function initClientsSlider() {
    const clientsSlider = document.querySelector('.clients-slider');
    if (!clientsSlider) return;
    
    const clientSlides = document.querySelectorAll('.client-slide');
    if (clientSlides.length === 0) return;
    
    console.log(`Initializing Clients Slider - ${clientSlides.length} clients`);
    
    // Simple hover effects for clients
    clientSlides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            slide.style.transform = 'translateY(-10px)';
        });
        
        slide.addEventListener('mouseleave', () => {
            slide.style.transform = 'translateY(0)';
        });
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    console.log(`Initializing Stats Counter - ${statNumbers.length} stats`);
    
    // Create observer for stats section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-row');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function animateStats() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ============================================
// WHATSAPP BUTTON FUNCTIONALITY
// ============================================

function initWhatsAppButton() {
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only track if opening in new tab
            if (!this.target || this.target === '_self') {
                e.preventDefault();
                
                const phone = '6281234567890';
                const message = 'Halo CV SR PUSPA JAYA, saya ingin berkonsultasi mengenai layanan Anda.';
                const encodedMessage = encodeURIComponent(message);
                
                window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
                
                console.log('WhatsApp button clicked');
            }
        });
    });
}

// ============================================
// CUSTOM ALERTS SYSTEM
// ============================================

function initCustomAlerts() {
    // Add custom alert styles
    const alertStyles = document.createElement('style');
    alertStyles.textContent = `
        .custom-alert {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid #FF6B6B;
            font-family: 'Roboto', sans-serif;
        }
        
        .alert-success {
            border-left-color: #28a745;
        }
        
        .alert-error {
            border-left-color: #dc3545;
        }
        
        .alert-warning {
            border-left-color: #ffc107;
        }
        
        .alert-info {
            border-left-color: #17a2b8;
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .alert-content i {
            font-size: 1.2rem;
        }
        
        .alert-success .alert-content i {
            color: #28a745;
        }
        
        .alert-error .alert-content i {
            color: #dc3545;
        }
        
        .alert-warning .alert-content i {
            color: #ffc107;
        }
        
        .alert-info .alert-content i {
            color: #17a2b8;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 0.25rem;
            margin-left: 1rem;
            transition: color 0.3s ease;
        }
        
        .alert-close:hover {
            color: #333;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .alert-hiding {
            animation: slideOutRight 0.3s ease forwards;
        }
        
        @media (max-width: 576px) {
            .custom-alert {
                min-width: auto;
                width: calc(100% - 40px);
                right: 20px;
                left: 20px;
                top: 80px;
            }
        }
    `;
    
    document.head.appendChild(alertStyles);
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => {
        alert.classList.add('alert-hiding');
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 300);
    });
    
    // Icon mapping
    const icons = {
        success: 'bi-check-circle',
        error: 'bi-exclamation-circle',
        warning: 'bi-exclamation-triangle',
        info: 'bi-info-circle'
    };
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="bi ${icons[type] || 'bi-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close" onclick="this.parentElement.classList.add('alert-hiding'); setTimeout(() => this.parentElement.remove(), 300)">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('alert-hiding');
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 300);
        }
    }, 5000);
    
    console.log(`Alert shown: ${type} - ${message}`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Set scroll margin for sections
function setScrollMargin() {
    const offset = window.innerWidth < 768 ? '70px' : '80px';
    document.querySelectorAll('section[id]').forEach(section => {
        section.style.scrollMarginTop = offset;
    });
}

// Get scrollbar width
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

// Adjust padding on resize
window.addEventListener('resize', function() {
    setScrollMargin();
});

// ============================================
// PRINT FUNCTIONALITY
// ============================================

function initPrintButton() {
    // Add print button if needed
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="bi bi-printer"></i>';
    printButton.className = 'print-button';
    printButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
        color: white;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    printButton.addEventListener('mouseenter', () => {
        printButton.style.transform = 'scale(1.1)';
    });
    
    printButton.addEventListener('mouseleave', () => {
        printButton.style.transform = 'scale(1)';
    });
    
    printButton.addEventListener('click', () => {
        window.print();
    });
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .navbar,
            .hero-cta,
            .back-to-top,
            .footer,
            .print-button,
            .cta-section {
                display: none !important;
            }
            
            body {
                padding-top: 0;
                font-size: 12pt;
            }
            
            .hero-section {
                min-height: auto;
                background: none !important;
                color: black !important;
                padding: 2rem 0;
            }
            
            .hero-title,
            .section-title {
                color: black !important;
            }
            
            .container {
                max-width: 100%;
            }
            
            a {
                color: black !important;
                text-decoration: none;
            }
            
            .btn {
                display: none !important;
            }
        }
    `;
    
    document.head.appendChild(printStyles);
    document.body.appendChild(printButton);
}

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, 'at', e.filename, ':', e.lineno);
    
    // Show user-friendly error message
    showAlert('Maaf, terjadi kesalahan teknis. Silakan refresh halaman.', 'error');
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log page load performance
window.addEventListener('load', function() {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Show welcome message
    setTimeout(() => {
        showAlert('Selamat datang di CV SR PUSPA JAYA!', 'info');
    }, 1000);
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

// Make functions available globally for HTML onclick attributes
window.openLightbox = openSimpleLightbox;
window.closeLightbox = closeSimpleLightbox;
window.prevImage = prevSimpleImage;
window.nextImage = nextSimpleImage;
window.showAlert = showAlert;

console.log('JavaScript loaded successfully!');