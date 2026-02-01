// ============================================
// WEBSITE CV SR PUSPA JAYA - SCRIPT.JS
// ============================================
// Versi: 2.1 - Fixed ScrollSpy & Navbar Active State
// ============================================

'use strict';

// ============================================
// GLOBAL VARIABLES
// ============================================
let currentImageIndex = 0;
let galleryImages = [];
let statsAnimated = false;
let navbarCollapsed = false;
let lastScrollTop = 0;
let scrollTimeout;
let currentActiveSection = 'home';
let isScrolling = false;

// ============================================
// DOM READY & INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website CV SR PUSPA JAYA - Initializing...');
    
    try {
        // Urutan inisialisasi yang penting
        initMobileDetection();
        setCurrentYear();
        initNavbarResponsive();
        initSmoothScrolling();
        initScrollSpy(); // FIXED: Mengganti initNavbarScroll dengan initScrollSpy
        initBackToTop();
        initSimpleLightbox();
        initFormValidation();
        initTestimonialsSlider();
        initClientsSlider();
        initCustomAlerts();
        initStatsCounter();
        setScrollMargin();
        initScrollAnimations();
        initWhatsAppButtons();
        
        console.log('✅ Initialization complete!');
        
        // Tampilkan welcome message setelah semua inisialisasi
        setTimeout(() => {
            if (!sessionStorage.getItem('welcomeShown')) {
                showAlert('Selamat datang di CV SR PUSPA JAYA! Spesialis Teralis & Reklame Profesional.', 'info');
                sessionStorage.setItem('welcomeShown', 'true');
            }
        }, 1500);
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showAlert('Maaf, terjadi kesalahan saat memuat halaman. Silakan refresh.', 'error');
    }
});

// ============================================
// CUSTOM SCROLLSPY FUNCTION - FIXED MAIN ISSUE
// ============================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) {
        console.warn('⚠️ No sections or nav links found for ScrollSpy');
        return;
    }
    
    console.log(`📍 Found ${sections.length} sections for ScrollSpy`);
    
    // Tambahkan event listener untuk scroll dengan debounce
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            updateActiveNavLink();
            
            // Debounce untuk performance
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
            }, 100);
        }
    }, { passive: true });
    
    // Update active state pada load
    updateActiveNavLink();
    
    // Update juga pada resize
    window.addEventListener('resize', debounce(updateActiveNavLink, 250));
    
    // Log untuk debugging
    console.log('🎯 Custom ScrollSpy initialized');
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY;
    const navbarHeight = window.innerWidth < 768 ? 70 : 80; // Height navbar
    
    let currentSectionId = '';
    let closestSectionId = '';
    let closestDistance = Infinity;
    
    // Cari section yang sedang aktif berdasarkan viewport
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionTop = section.offsetTop - navbarHeight - 100; // Offset untuk deteksi awal
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Jika scroll position berada di dalam section (dengan buffer)
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSectionId = sectionId;
        }
        
        // Hitung jarak untuk mencari yang terdekat (fallback)
        const distance = Math.abs(scrollPosition - sectionTop);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSectionId = sectionId;
        }
    });
    
    // Gunakan section terdekat jika tidak ada yang aktif
    if (!currentSectionId && closestSectionId) {
        currentSectionId = closestSectionId;
    }
    
    // Jika di paling atas, paksa ke home
    if (scrollPosition < 100) {
        currentSectionId = 'home';
    }
    
    // Update active class hanya jika berubah
    if (currentSectionId && currentSectionId !== currentActiveSection) {
        currentActiveSection = currentSectionId;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
                
                // Untuk debugging
                console.log(`📍 Active section changed to: ${currentSectionId}`);
            }
        });
        
        // Jika tidak ada yang active, set home sebagai default
        const anyActive = Array.from(navLinks).some(link => link.classList.contains('active'));
        if (!anyActive) {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                currentActiveSection = 'home';
            }
        }
    }
}

// ============================================
// MOBILE DETECTION & RESPONSIVE HELPERS
// ============================================

function initMobileDetection() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 992;
    
    // Tambahkan class ke body untuk styling responsif
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    if (isTablet) {
        document.body.classList.add('tablet-device');
    }
    
    console.log(`📱 Device detection: Mobile=${isMobile}, Tablet=${isTablet}`);
    
    // Update pada resize
    window.addEventListener('resize', debounce(function() {
        const nowMobile = window.innerWidth <= 768;
        const nowTablet = window.innerWidth <= 992;
        
        document.body.classList.toggle('mobile-device', nowMobile);
        document.body.classList.toggle('tablet-device', nowTablet);
        
        // Update scroll spy setelah resize
        updateActiveNavLink();
    }, 250));
}

// ============================================
// CURRENT YEAR IN FOOTER
// ============================================

function setCurrentYear() {
    try {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.warn('Could not set current year:', error);
    }
}

// ============================================
// NAVBAR RESPONSIVE BEHAVIOR - UPDATED
// ============================================

function initNavbarResponsive() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Deteksi klik di luar navbar untuk menutup di mobile
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbarCollapse.contains(event.target) || 
                                   navbarToggler.contains(event.target);
        
        if (navbarCollapse.classList.contains('show') && !isClickInsideNavbar && window.innerWidth < 992) {
            navbarToggler.click();
        }
    });
    
    // Update status navbar collapse
    navbarCollapse.addEventListener('show.bs.collapse', () => {
        navbarCollapsed = true;
        document.body.style.overflow = 'hidden';
    });
    
    navbarCollapse.addEventListener('hide.bs.collapse', () => {
        navbarCollapsed = false;
        document.body.style.overflow = '';
    });
    
    // Navbar link klik untuk mobile - dengan update active state
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Update active state manual saat klik
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update current active section
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                currentActiveSection = href.substring(1);
            }
            
            // Tutup navbar di mobile
            if (window.innerWidth < 992) {
                setTimeout(() => {
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }, 300);
            }
        });
    });
}

// ============================================
// SMOOTH SCROLLING - UPDATED WITH ACTIVE STATE
// ============================================

function initSmoothScrolling() {
    // Smooth scrolling untuk semua anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip untuk link yang tidak perlu smooth scroll
        if (anchor.hash === '#!' || anchor.hash === '#' || 
            anchor.getAttribute('href') === '#lightbox' ||
            anchor.getAttribute('data-no-scroll') === 'true') {
            return;
        }
        
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip jika bukan anchor
            if (!targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Update active state secara manual
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                currentActiveSection = targetId.substring(1);
                
                // Tutup navbar mobile jika terbuka
                if (window.innerWidth < 992 && navbarCollapsed) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) {
                        navbarToggler.click();
                    }
                }
                
                // Hitung offset berdasarkan device
                const navbarHeight = window.innerWidth < 768 ? 70 : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight;
                
                // Smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL tanpa refresh
                history.pushState(null, null, targetId);
                
                console.log(`↕️ Scrolled to: ${targetId}, Active: ${currentActiveSection}`);
                
                // Panggil updateActiveNavLink setelah scroll selesai
                setTimeout(updateActiveNavLink, 500);
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON - UPDATED
// ============================================

function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
            backToTop.setAttribute('aria-hidden', 'false');
        } else {
            backToTop.classList.remove('active');
            backToTop.setAttribute('aria-hidden', 'true');
        }
    }, 150));
    
    // Click handler - dengan reset active state ke home
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state ke home
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
            currentActiveSection = 'home';
        }
        
        // Smooth scroll ke atas
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, '#home');
        
        // Update active nav link setelah scroll
        setTimeout(updateActiveNavLink, 500);
        
        // Fokus ke navbar brand setelah scroll
        setTimeout(() => {
            const navbarBrand = document.querySelector('.navbar-brand');
            if (navbarBrand) {
                navbarBrand.focus();
            }
        }, 500);
    });
}

// ============================================
// SIMPLE LIGHTBOX GALLERY - RESPONSIF
// ============================================

function initSimpleLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (galleryItems.length === 0) {
        console.log('ℹ️ No gallery images found');
        return;
    }
    
    console.log(`🖼️ Found ${galleryItems.length} gallery images`);
    
    // Kumpulkan data gambar
    galleryImages = Array.from(galleryItems).map((img, index) => ({
        src: img.src,
        alt: img.alt || `Gambar karya ${index + 1}`,
        index: index
    }));
    
    // Tambahkan event listener untuk gambar
    galleryImages.forEach((item, index) => {
        const imgElement = galleryItems[index];
        imgElement.style.cursor = 'zoom-in';
        
        // Touch support untuk mobile
        imgElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openSimpleLightbox(index);
        });
        
        // Tambahkan keyboard enter support
        imgElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                openSimpleLightbox(index);
            }
        });
    });
    
    // Buat elemen lightbox jika belum ada
    createSimpleLightboxElements();
}

function createSimpleLightboxElements() {
    if (document.getElementById('simple-lightbox')) return;
    
    const lightboxHTML = `
        <div id="simple-lightbox" class="lightbox" role="dialog" aria-label="Galeri gambar" aria-hidden="true">
            <div class="lightbox-overlay" onclick="closeSimpleLightbox()"></div>
            <button class="lightbox-close" onclick="closeSimpleLightbox()" aria-label="Tutup galeri">
                <i class="bi bi-x-lg"></i>
            </button>
            <button class="lightbox-prev" onclick="prevSimpleImage()" aria-label="Gambar sebelumnya">
                <i class="bi bi-chevron-left"></i>
            </button>
            <div class="lightbox-content">
                <div class="lightbox-counter" id="lightbox-counter">1 / ${galleryImages.length}</div>
                <img id="lightbox-img" src="" alt="" loading="eager">
                <div class="lightbox-caption" id="lightbox-caption"></div>
            </div>
            <button class="lightbox-next" onclick="nextSimpleImage()" aria-label="Gambar berikutnya">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

function openSimpleLightbox(index = 0) {
    if (!galleryImages || galleryImages.length === 0) {
        showAlert('Tidak ada gambar untuk ditampilkan.', 'warning');
        return;
    }
    
    // Validasi index
    if (index < 0) index = 0;
    if (index >= galleryImages.length) index = galleryImages.length - 1;
    
    currentImageIndex = index;
    
    const lightbox = document.getElementById('simple-lightbox');
    const img = galleryImages[currentImageIndex];
    
    if (!lightbox || !img) return;
    
    // Update konten
    updateSimpleLightbox();
    
    // Tampilkan lightbox
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    
    // Lock scroll untuk mobile
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }
    
    // Tambahkan keyboard navigation
    document.addEventListener('keydown', handleSimpleKeydown);
    
    console.log(`🔍 Lightbox opened: ${currentImageIndex + 1}/${galleryImages.length}`);
}

function closeSimpleLightbox() {
    const lightbox = document.getElementById('simple-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore scroll
    if (window.innerWidth <= 768) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
    
    // Hapus keyboard navigation
    document.removeEventListener('keydown', handleSimpleKeydown);
}

function updateSimpleLightbox() {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightboxImg || !galleryImages[currentImageIndex]) return;
    
    const image = galleryImages[currentImageIndex];
    
    // Loading state
    lightboxImg.style.opacity = '0.5';
    lightboxImg.style.filter = 'blur(5px)';
    
    // Preload gambar
    const imgLoader = new Image();
    imgLoader.src = image.src;
    
    imgLoader.onload = () => {
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxImg.style.opacity = '1';
        lightboxImg.style.filter = 'blur(0)';
        
        if (lightboxCaption) {
            lightboxCaption.textContent = image.alt;
        }
    };
    
    imgLoader.onerror = () => {
        lightboxImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNMzAgMjBDMjYuMTM0IDIwIDIzIDIzLjEzNCAyMyAyN0MyMyAzMC44NjYgMjYuMTM0IDM0IDMwIDM0QzMzLjg2NiAzNCAzNyAzMC44NjYgMzcgMjdDMzcgMjMuMTM0IDMzLjg2NiAyMCAzMCAyMFpNMjAgMzJDMjAgMjYuNDc3IDI0LjQ3NyAyMiAzMCAyMkMzNS41MjMgMjIgNDAgMjYuNDc3IDQwIDMyQzQwIDM3LjUyMyAzNS41MjMgNDIgMzAgNDJDMjQuNDc3IDQyIDIwIDM3LjUyMyAyMCAzMlpNMjAgMzVDMTguODk1IDM1IDE4IDM1Ljg5NSAxOCAzN0MxOCAzOC4xMDUgMTguODk1IDM5IDIwIDM5SDQwQzQxLjEwNSAzOSA0MiAzOC4xMDUgNDIgMzdDNDIgMzUuODk1IDQxLjEwNSAzNSA0MCAzNUgyMFoiIGZpbGw9IiNGRjZCNkIiLz48L3N2Zz4=';
        lightboxImg.alt = 'Gambar tidak dapat dimuat';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.filter = 'blur(0)';
        
        if (lightboxCaption) {
            lightboxCaption.textContent = 'Gambar tidak dapat dimuat';
        }
    };
    
    // Update counter
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

function nextSimpleImage() {
    if (!galleryImages || galleryImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateSimpleLightbox();
}

function prevSimpleImage() {
    if (!galleryImages || galleryImages.length === 0) return;
    
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateSimpleLightbox();
}

function handleSimpleKeydown(e) {
    if (!galleryImages || galleryImages.length === 0) return;
    
    switch(e.key) {
        case 'Escape':
            closeSimpleLightbox();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            nextSimpleImage();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            prevSimpleImage();
            break;
        case ' ':
            e.preventDefault();
            nextSimpleImage();
            break;
    }
}

// ============================================
// CONTACT FORM VALIDATION
// ============================================

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log('ℹ️ Contact form not found');
        return;
    }
    
    console.log('📝 Initializing Contact Form...');
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Validasi saat blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Hapus error saat typing
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validasi semua field
        let isValid = true;
        let firstInvalidField = null;
        
        formInputs.forEach(input => {
            if (!validateField(input) && isValid) {
                isValid = false;
                firstInvalidField = input;
            }
        });
        
        if (!isValid) {
            // Scroll ke field pertama yang invalid
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                firstInvalidField.focus();
            }
            
            showAlert('Harap perbaiki data yang masih salah.', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            name: sanitizeInput(document.getElementById('name').value),
            phone: sanitizeInput(document.getElementById('phone').value),
            email: sanitizeInput(document.getElementById('email').value),
            subject: document.getElementById('subject').value,
            message: sanitizeInput(document.getElementById('message').value),
            timestamp: new Date().toISOString()
        };
        
        // Kirim data (simulasi)
        submitFormData(formData);
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    
    // Email validation
    if (field.type === 'email' && value && isValid) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value && isValid) {
        const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,15}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format nomor telepon tidak valid';
        }
    }
    
    // Update UI
    if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Show error tooltip
        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        // Remove error tooltip
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    return isValid;
}

function sanitizeInput(input) {
    return input.trim()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
}

function submitFormData(formData) {
    console.log('📤 Form data to submit:', formData);
    
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const originalState = submitButton.disabled;
    
    // Show loading state
    submitButton.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Mengirim...';
    submitButton.disabled = true;
    
    // Simulasi pengiriman data
    setTimeout(() => {
        // Success scenario
        showAlert(`Terima kasih ${formData.name}! Pesan Anda telah dikirim. Kami akan menghubungi Anda dalam 1x24 jam.`, 'success');
        
        // Reset form
        contactForm.reset();
        
        // Remove validation classes
        contactForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        // Remove error messages
        contactForm.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
        
        // Restore button
        submitButton.innerHTML = originalText;
        submitButton.disabled = originalState;
        
        // Optional: Send to WhatsApp
        const shouldOpenWhatsApp = confirm('Buka WhatsApp untuk konsultasi lebih lanjut?');
        if (shouldOpenWhatsApp) {
            const whatsappMessage = `Halo CV SR PUSPA JAYA,%0A%0A`
                + `Nama: ${formData.name}%0A`
                + `Telepon: ${formData.phone}%0A`
                + `Email: ${formData.email}%0A`
                + `Layanan: ${formData.subject}%0A`
                + `Pesan: ${formData.message}`;
            
            window.open(`https://wa.me/6287813559019?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        }
        
    }, 1500);
}

// ============================================
// TESTIMONIALS SLIDER - RESPONSIF
// ============================================

function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;
    
    console.log(`💬 Found ${testimonialCards.length} testimonials`);
    
    // Hanya aktifkan auto-rotate di desktop
    if (window.innerWidth > 768) {
        let currentIndex = 0;
        
        const rotateTestimonials = () => {
            testimonialCards.forEach((card, index) => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = index === currentIndex ? '1' : '0.6';
                card.style.transform = index === currentIndex ? 'translateY(0)' : 'translateY(10px)';
            });
            
            currentIndex = (currentIndex + 1) % testimonialCards.length;
        };
        
        // Mulai rotasi
        setInterval(rotateTestimonials, 5000);
        
        // Rotasi pertama
        setTimeout(rotateTestimonials, 1000);
    }
    
    // Tambahkan hover effect untuk semua device
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            }
        });
    });
}

// ============================================
// CLIENTS SLIDER - RESPONSIF
// ============================================

function initClientsSlider() {
    const clientSlides = document.querySelectorAll('.client-slide');
    if (clientSlides.length === 0) return;
    
    console.log(`🤝 Found ${clientSlides.length} client logos`);
    
    // Hover effects untuk desktop
    if (window.innerWidth > 768) {
        clientSlides.forEach(slide => {
            slide.addEventListener('mouseenter', () => {
                slide.style.transform = 'translateY(-8px)';
                slide.style.transition = 'transform 0.3s ease';
            });
            
            slide.addEventListener('mouseleave', () => {
                slide.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Touch/swipe support untuk mobile
    if (window.innerWidth <= 768) {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                // Simple visual feedback
                clientSlides.forEach(slide => {
                    slide.style.transform = diffX > 0 ? 'translateX(-10px)' : 'translateX(10px)';
                    setTimeout(() => {
                        slide.style.transform = 'translateX(0)';
                    }, 300);
                });
            }
        }, { passive: true });
    }
}

// ============================================
// CUSTOM ALERTS SYSTEM
// ============================================

function initCustomAlerts() {
    // Inject alert styles
    if (!document.getElementById('alert-styles')) {
        const alertStyles = document.createElement('style');
        alertStyles.id = 'alert-styles';
        alertStyles.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 1rem;
                min-width: 300px;
                max-width: 400px;
                z-index: 99999;
                animation: alertSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                border-left: 5px solid;
                font-family: 'Roboto', sans-serif;
                backdrop-filter: blur(10px);
                background: rgba(255, 255, 255, 0.95);
            }
            
            .alert-success { border-left-color: #28a745; }
            .alert-error { border-left-color: #dc3545; }
            .alert-warning { border-left-color: #ffc107; }
            .alert-info { border-left-color: #17a2b8; }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }
            
            .alert-content i {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .alert-success .alert-content i { color: #28a745; }
            .alert-error .alert-content i { color: #dc3545; }
            .alert-warning .alert-content i { color: #ffc107; }
            .alert-info .alert-content i { color: #17a2b8; }
            
            .alert-text {
                flex: 1;
                font-size: 0.95rem;
                line-height: 1.4;
            }
            
            .alert-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 0.25rem;
                transition: all 0.2s ease;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .alert-close:hover {
                background: rgba(0,0,0,0.05);
                color: #333;
            }
            
            @keyframes alertSlideIn {
                from {
                    transform: translateX(100%) translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes alertSlideOut {
                from {
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%) translateY(-20px);
                    opacity: 0;
                }
            }
            
            .alert-hiding {
                animation: alertSlideOut 0.3s ease forwards;
            }
            
            /* Mobile styles */
            @media (max-width: 768px) {
                .custom-alert {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                    padding: 0.875rem 1.25rem;
                }
                
                .alert-text {
                    font-size: 0.875rem;
                }
            }
            
            @media (max-width: 480px) {
                .custom-alert {
                    padding: 0.75rem 1rem;
                }
                
                .alert-content i {
                    font-size: 1.25rem;
                }
            }
        `;
        
        document.head.appendChild(alertStyles);
    }
}

function showAlert(message, type = 'info') {
    // Icon mapping
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach((alert, index) => {
        setTimeout(() => {
            alert.classList.add('alert-hiding');
            setTimeout(() => alert.remove(), 300);
        }, index * 100);
    });
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'assertive');
    
    alert.innerHTML = `
        <div class="alert-content">
            <i class="bi ${icons[type] || 'bi-info-circle-fill'}"></i>
            <div class="alert-text">${message}</div>
        </div>
        <button class="alert-close" aria-label="Tutup notifikasi" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(alert);
    
    // Auto-remove setelah 5 detik
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
    
    // Log untuk debugging
    console.log(`📢 Alert: ${type.toUpperCase()} - ${message}`);
    
    return alert;
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    // Observer untuk stats section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-row') || document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function animateStats() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = 2000; // 2 detik
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                
                // Tambahkan efek setelah selesai
                counter.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 300);
            }
        };
        
        updateCounter();
    });
}

// ============================================
// SCROLL MARGIN UTILITIES
// ============================================

function setScrollMargin() {
    // Set scroll margin untuk semua section dengan ID
    document.querySelectorAll('section[id]').forEach(section => {
        const offset = window.innerWidth < 768 ? '70px' : '80px';
        section.style.scrollMarginTop = offset;
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    // Intersection Observer untuk animasi
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Element yang akan dianimasikan
    const animatedElements = document.querySelectorAll(
        '.service-card, .gallery-item, .testimonial-card, .value-box, .description-card, .client-logo'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    console.log(`🎨 Animating ${animatedElements.length} elements on scroll`);
}

// ============================================
// WHATSAPP BUTTONS FUNCTIONALITY
// ============================================

function initWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"], .btn-whatsapp');
    
    whatsappButtons.forEach(button => {
        // Pastikan semua WhatsApp button memiliki target="_blank"
        if (!button.hasAttribute('target')) {
            button.setAttribute('target', '_blank');
        }
        
        // Tambahkan rel untuk security
        button.setAttribute('rel', 'noopener noreferrer');
        
        // Tambahkan event untuk tracking (optional)
        button.addEventListener('click', function() {
            console.log('📱 WhatsApp button clicked');
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function untuk limit events
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

// Throttle function untuk limit events
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

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', debounce(function() {
    // Update scroll margin
    setScrollMargin();
    
    // Update navbar active state
    updateActiveNavLink();
    
    // Re-init components yang perlu responsive update
    const lightbox = document.getElementById('simple-lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        updateSimpleLightbox();
    }
    
    console.log(`🔄 Window resized: ${window.innerWidth} x ${window.innerHeight}`);
}, 250));

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.message, 'at', e.filename, ':', e.lineno);
    
    // Show user-friendly error message
    if (!e.message.includes('ResizeObserver') && !e.message.includes('Script error')) {
        showAlert('Maaf, terjadi kesalahan teknis. Silakan refresh halaman.', 'error');
    }
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', function() {
    // Log page load performance
    if (performance.getEntriesByType) {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries[0]) {
            const loadTime = perfEntries[0].loadEventEnd - perfEntries[0].startTime;
            console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
        }
    }
    
    // Remove preloader jika ada
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 500);
    }
    
    // Update active nav link setelah page fully loaded
    setTimeout(updateActiveNavLink, 100);
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================

window.openSimpleLightbox = openSimpleLightbox;
window.closeSimpleLightbox = closeSimpleLightbox;
window.prevSimpleImage = prevSimpleImage;
window.nextSimpleImage = nextSimpleImage;
window.showAlert = showAlert;

console.log('🎯 All scripts loaded successfully!');