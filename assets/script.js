// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// Scroll spy: highlight nav link for section most in view
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
    if (sections.length === 0 || navLinks.length === 0) return;

    const linkById = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
    function setActive(id) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = linkById.get(id);
        if (link) link.classList.add('active');
    }

    let currentId = null;
    const observer = new IntersectionObserver(
        (entries) => {
            // Select the section with the highest visibility
            let best = null;
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                if (!best || entry.intersectionRatio > best.intersectionRatio) {
                    best = entry;
                }
            }
            if (best && best.target.id !== currentId) {
                currentId = best.target.id;
                setActive(currentId);
            }
        },
        {
            root: null,
            // Offset for fixed navbar and to switch sooner
            // top: -80px (approx nav height), bottom: -40% of viewport
            rootMargin: '-80px 0px -40% 0px',
            threshold: [0.1, 0.25, 0.5, 0.75]
        }
    );

    sections.forEach(sec => observer.observe(sec));

    // Immediate feedback on click; observer will correct during/after scroll
    navLinks.forEach(a => {
        a.addEventListener('click', () => {
            const id = a.getAttribute('href').slice(1);
            setActive(id);
        });
    });
})();

// Form submission
function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your RSVP! We will contact you soon with more details.');
    e.target.reset();
}

// Gallery click to view (Updated for Lightbox)
document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', function () {
        // Open lightbox with gallery images
        openLightbox(index, 'gallery');
    });
});

// Countdown to wedding: 30 Nov 2025 10:30 (local time)
(function () {
    const target = new Date(2025, 10, 30, 22, 0, 0); // month is 0-indexed: 10 -> November
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now = new Date();
        let diff = Math.max(0, target - now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);

        setIfChanged(els.days, days);
        setIfChanged(els.hours, pad(hours));
        setIfChanged(els.minutes, pad(minutes));
        setIfChanged(els.seconds, pad(seconds));
    }

    function setIfChanged(el, value) {
        if (!el) return;
        const old = el.textContent;
        const newVal = String(value);
        if (old !== newVal) {
            el.textContent = newVal;
            const parent = el.parentElement;
            if (parent) {
                parent.classList.remove('update');
                void parent.offsetWidth; // force reflow
                parent.classList.add('update');
                setTimeout(() => parent.classList.remove('update'), 600);
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();

// Equalize story item heights
function equalizeStoryHeights() {
    const storyItems = document.querySelectorAll('.story-item');
    if (storyItems.length === 0) return;

    // Reset heights to auto to get natural heights
    storyItems.forEach(item => {
        item.style.height = 'auto';
    });

    // Find the maximum height
    let maxHeight = 0;
    storyItems.forEach(item => {
        const height = item.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    // Apply max height to all items
    storyItems.forEach(item => {
        item.style.height = maxHeight + 'px';
    });
}

// Run on page load and window resize
window.addEventListener('load', equalizeStoryHeights);
window.addEventListener('resize', equalizeStoryHeights);

// Also run after a short delay to ensure images are loaded
setTimeout(equalizeStoryHeights, 100);

// Equalize event card heights
function equalizeEventCardHeights() {
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length === 0) return;

    // Reset heights to auto to get natural heights
    eventCards.forEach(card => {
        card.style.height = 'auto';
    });

    // Find the maximum height
    let maxHeight = 0;
    eventCards.forEach(card => {
        const height = card.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    // Apply max height to all cards
    eventCards.forEach(card => {
        card.style.height = maxHeight + 'px';
    });
}

// Run on page load and window resize
window.addEventListener('load', equalizeEventCardHeights);
window.addEventListener('resize', equalizeEventCardHeights);

// Also run after a short delay to ensure images are loaded
setTimeout(equalizeEventCardHeights, 100);

// Theme Toggle Functionality
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved theme preference or default to dark theme
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-theme');

        // Update icon based on current theme
        if (body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
})();

// Events Carousel
(function () {
    const carousel = document.querySelector('.events-container');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const cards = document.querySelectorAll('.event-card');

    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentIndex = 0;
    let autoScrollInterval = null;
    let isUserInteracting = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function getVisibleCards() {
        const containerWidth = carousel.offsetWidth;
        const cardWidth = cards[0] ? cards[0].offsetWidth + 25 : 0; // card width + gap
        if (cardWidth === 0) return 3; // fallback
        return Math.floor(containerWidth / cardWidth) || 1;
    }

    function updateCarousel(instant = false) {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: wrap around
        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const cardWidth = cards[0] ? cards[0].offsetWidth + 25 : 0;
        const scrollPosition = currentIndex * cardWidth;

        carousel.scrollTo({
            left: scrollPosition,
            behavior: instant ? 'auto' : 'smooth'
        });

        // Remove disabled states for infinite loop
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function handleResize() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Clamp currentIndex if it's out of bounds
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        updateCarousel();
    }

    function startAutoScroll() {
        // Clear any existing interval
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }

        // Start auto-scroll (every 4 seconds)
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting) {
                const visibleCards = getVisibleCards();
                const maxIndex = Math.max(0, cards.length - visibleCards);

                // Move to next, loop if at end
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }

                updateCarousel();
            }
        }, 4000);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    function pauseAutoScroll() {
        isUserInteracting = true;
        stopAutoScroll();

        // Resume after 5 seconds of no interaction
        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 5000);
    }

    prevBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: go to end if at start
        if (currentIndex <= 0) {
            currentIndex = maxIndex;
        } else {
            currentIndex--;
        }

        updateCarousel();
        pauseAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: go to start if at end
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        updateCarousel();
        pauseAutoScroll();
    });
    // Touch event listeners for swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isUserInteracting = true; // Pause auto-scroll on touch
        stopAutoScroll();
    });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
        // Resume auto-scroll after a delay
        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 5000);
    });
    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right
            if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateCarousel();
        }
    }
    // Pause auto-scroll on hover
    carousel.addEventListener('mouseenter', () => {
        pauseAutoScroll();
    });

    carousel.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startAutoScroll();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateCarousel(true);
            startAutoScroll();
        }, 100);
    });

    // Initialize immediately
    updateCarousel(true);
    startAutoScroll();
})();

// Unified Lightbox & Gallery Modal Functionality
let openLightbox; // Expose globally for click handlers

(function () {
    const downloadBtn = document.getElementById('downloadBtn');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalClose = document.getElementById('galleryModalClose');
    const galleryModalBackdrop = document.getElementById('galleryModalBackdrop');
    const galleryModalGrid = document.getElementById('galleryModalGrid');
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxDownload = document.getElementById('lightboxDownload');
    const hiddenDownloadLink = document.getElementById('hiddenDownloadLink');
    const body = document.body;

    // Lightbox slider elements
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Wedding card images
    const weddingCardImages = [
        'assets/wedding-card-1.jpg',
        'assets/wedding-card-2.jpg',
        'assets/wedding-card-3.jpg',
        'assets/wedding-card-4.jpg',
        'assets/wedding-card-5.jpg'
    ];

    // Gallery images (dynamically populated)
    let galleryImages = [];
    document.querySelectorAll('.gallery-item').forEach(item => {
        const bgImage = window.getComputedStyle(item).backgroundImage;
        // Extract URL from url("...")
        const url = bgImage.slice(5, -2);
        galleryImages.push(url);
    });

    let currentLightboxImages = [];
    let currentLightboxIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Track scroll position and modal state
    let scrollPosition = 0;
    let isScrollDisabled = false;

    // Function to disable body scroll
    function disableBodyScroll() {
        if (!isScrollDisabled) {
            scrollPosition = window.scrollY;
            body.classList.add('modal-open');
            body.style.position = 'fixed';
            body.style.top = `-${scrollPosition}px`;
            body.style.width = '100%';
            isScrollDisabled = true;
        }
    }

    // Function to enable body scroll
    function enableBodyScroll() {
        const galleryModalOpen = galleryModal.classList.contains('active');
        const lightboxOpen = imageLightbox.classList.contains('active');

        if (isScrollDisabled && !galleryModalOpen && !lightboxOpen) {
            body.classList.remove('modal-open');
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            window.scrollTo(0, scrollPosition);
            isScrollDisabled = false;
        }
    }

    // Function to open gallery modal (Invitation Cards)
    function openGalleryModal() {
        galleryModalGrid.innerHTML = '';
        weddingCardImages.forEach((imageSrc, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-modal-item';
            item.style.backgroundImage = `url(${imageSrc})`;
            item.setAttribute('data-index', index);
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `View image ${index + 1}`);

            item.addEventListener('click', () => openLightbox(index, 'invitation'));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index, 'invitation');
                }
            });

            galleryModalGrid.appendChild(item);
        });
        galleryModal.classList.add('active');
        galleryModal.setAttribute('aria-hidden', 'false');
        disableBodyScroll();
    }

    // Function to close gallery modal
    function closeGalleryModal() {
        galleryModal.classList.remove('active');
        galleryModal.setAttribute('aria-hidden', 'true');
        enableBodyScroll();
    }

    // Function to show a specific image in the lightbox
    function showLightboxImage(index) {
        if (index < 0) index = currentLightboxImages.length - 1; // Loop to end
        if (index >= currentLightboxImages.length) index = 0; // Loop to start

        currentLightboxIndex = index;
        const imageSrc = currentLightboxImages[currentLightboxIndex];

        // Set image source directly without fade effect to prevent flashing
        lightboxImage.src = imageSrc;
        lightboxImage.alt = `Image ${currentLightboxIndex + 1}`;
        lightboxDownload.setAttribute('data-download', imageSrc);
    }

    // Function to open lightbox
    // type: 'invitation' or 'gallery'
    openLightbox = function (index, type = 'gallery') {
        // Set the correct image array BEFORE opening lightbox
        if (type === 'invitation') {
            currentLightboxImages = [...weddingCardImages]; // Use copy to prevent reference issues
        } else {
            currentLightboxImages = [...galleryImages]; // Use copy to prevent reference issues
        }

        imageLightbox.classList.add('active');
        imageLightbox.setAttribute('aria-hidden', 'false');
        showLightboxImage(index);
        disableBodyScroll();
    };

    // Function to close lightbox
    function closeLightbox() {
        imageLightbox.classList.remove('active');
        imageLightbox.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300); // Clear after transition
        enableBodyScroll();
    }

    // Function to download image
    function downloadImage(imageSrc) {
        const link = hiddenDownloadLink;
        link.href = imageSrc;
        const filename = imageSrc.split('/').pop() || 'image.jpg';
        link.download = filename;
        link.click();
    }

    // Swipe gesture handler for lightbox
    function handleSwipeGesture() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left -> Next
            showLightboxImage(currentLightboxIndex + 1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right -> Prev
            showLightboxImage(currentLightboxIndex - 1);
        }
    }

    // Event listeners
    if (downloadBtn) downloadBtn.addEventListener('click', openGalleryModal);
    if (galleryModalClose) galleryModalClose.addEventListener('click', closeGalleryModal);
    if (galleryModalBackdrop) galleryModalBackdrop.addEventListener('click', closeGalleryModal);
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentLightboxIndex - 1);
    });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showLightboxImage(currentLightboxIndex + 1);
    });

    if (lightboxDownload) {
        lightboxDownload.addEventListener('click', function (e) {
            e.stopPropagation();
            const imageSrc = this.getAttribute('data-download');
            if (imageSrc) downloadImage(imageSrc);
        });
    }

    // Touch listeners for lightbox swipe
    if (imageLightbox) {
        imageLightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        imageLightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
    }

    // Keyboard navigation and closing modals
    document.addEventListener('keydown', function (e) {
        if (imageLightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showLightboxImage(currentLightboxIndex - 1);
            else if (e.key === 'ArrowRight') showLightboxImage(currentLightboxIndex + 1);
            else if (e.key === 'Escape') closeLightbox();
        } else if (galleryModal.classList.contains('active')) {
            if (e.key === 'Escape') closeGalleryModal();
        }
    });

    // Prevent modal from closing when clicking inside content
    const galleryModalContent = galleryModal.querySelector('.gallery-modal-content');
    if (galleryModalContent) {
        galleryModalContent.addEventListener('click', (e) => e.stopPropagation());
    }
    const lightboxContent = imageLightbox.querySelector('.lightbox-content');
    if (lightboxContent) {
        lightboxContent.addEventListener('click', (e) => {
            // Only close if clicking the content wrapper itself (background), not the image
            if (e.target === lightboxContent) {
                closeLightbox();
            }
        });
    }
    // Prevent clicks on image from closing (redundant with above but safe)
    if (lightboxImage) {
        lightboxImage.addEventListener('click', (e) => e.stopPropagation());
    }
})();

// Countdown to wedding: 30 Nov 2025 10:30 (local time)
(function () {
    const target = new Date(2025, 10, 30, 22, 0, 0); // month is 0-indexed: 10 -> November
    const countdownContainer = document.getElementById('countdown');
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    let intervalId = null;

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        const now = new Date();
        let diff = Math.max(0, target - now);

        // Condition added: If timer completes
        if (diff <= 0) {
            if (intervalId) clearInterval(intervalId);
            
            // Replace content with "Happily Married"
            // We use the 'countdown-value' class to inherit the same font size and style
            countdownContainer.innerHTML = '<span class="countdown-value" style="display: block; width: 100%; text-align: center;">Happily Married</span>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);
        const seconds = Math.floor(diff / 1000);

        setIfChanged(els.days, days);
        setIfChanged(els.hours, pad(hours));
        setIfChanged(els.minutes, pad(minutes));
        setIfChanged(els.seconds, pad(seconds));
    }

    function setIfChanged(el, value) {
        if (!el) return;
        const old = el.textContent;
        const newVal = String(value);
        if (old !== newVal) {
            el.textContent = newVal;
            const parent = el.parentElement;
            if (parent) {
                parent.classList.remove('update');
                void parent.offsetWidth; // force reflow
                parent.classList.add('update');
                setTimeout(() => parent.classList.remove('update'), 600);
            }
        }
    }

    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
})();

// Equalize story item heights
function equalizeStoryHeights() {
    const storyItems = document.querySelectorAll('.story-item');
    if (storyItems.length === 0) return;

    // Reset heights to auto to get natural heights
    storyItems.forEach(item => {
        item.style.height = 'auto';
    });

    // Find the maximum height
    let maxHeight = 0;
    storyItems.forEach(item => {
        const height = item.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    // Apply max height to all items
    storyItems.forEach(item => {
        item.style.height = maxHeight + 'px';
    });
}

// Run on page load and window resize
window.addEventListener('load', equalizeStoryHeights);
window.addEventListener('resize', equalizeStoryHeights);

// Also run after a short delay to ensure images are loaded
setTimeout(equalizeStoryHeights, 100);

// Equalize event card heights
function equalizeEventCardHeights() {
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length === 0) return;

    // Reset heights to auto to get natural heights
    eventCards.forEach(card => {
        card.style.height = 'auto';
    });

    // Find the maximum height
    let maxHeight = 0;
    eventCards.forEach(card => {
        const height = card.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    // Apply max height to all cards
    eventCards.forEach(card => {
        card.style.height = maxHeight + 'px';
    });
}

// Run on page load and window resize
window.addEventListener('load', equalizeEventCardHeights);
window.addEventListener('resize', equalizeEventCardHeights);

// Also run after a short delay to ensure images are loaded
setTimeout(equalizeEventCardHeights, 100);

// Theme Toggle Functionality
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved theme preference or default to dark theme
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-theme');
        // Update icon based on current theme
        if (body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
})();

// Events Carousel
(function () {
    const carousel = document.querySelector('.events-container');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const cards = document.querySelectorAll('.event-card');

    if (!carousel || !prevBtn || !nextBtn || cards.length === 0) return;

    let currentIndex = 0;
    let autoScrollInterval = null;
    let isUserInteracting = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function getVisibleCards() {
        const containerWidth = carousel.offsetWidth;
        const cardWidth = cards[0] ? cards[0].offsetWidth + 25 : 0; // card width + gap
        if (cardWidth === 0) return 3; // fallback
        return Math.floor(containerWidth / cardWidth) || 1;
    }

    function updateCarousel(instant = false) {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: wrap around
        if (currentIndex < 0) {
            currentIndex = maxIndex;
        } else if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const cardWidth = cards[0] ? cards[0].offsetWidth + 25 : 0;
        const scrollPosition = currentIndex * cardWidth;

        carousel.scrollTo({
            left: scrollPosition,
            behavior: instant ? 'auto' : 'smooth'
        });

        // Remove disabled states for infinite loop
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function handleResize() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Clamp currentIndex if it's out of bounds
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        updateCarousel();
    }

    function startAutoScroll() {
        // Clear any existing interval
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }

        // Start auto-scroll (every 4 seconds)
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting) {
                const visibleCards = getVisibleCards();
                const maxIndex = Math.max(0, cards.length - visibleCards);

                // Move to next, loop if at end
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }

                updateCarousel();
            }
        }, 4000);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    function pauseAutoScroll() {
        isUserInteracting = true;
        stopAutoScroll();

        // Resume after 5 seconds of no interaction
        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 5000);
    }

    prevBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: go to end if at start
        if (currentIndex <= 0) {
            currentIndex = maxIndex;
        } else {
            currentIndex--;
        }

        updateCarousel();
        pauseAutoScroll();
    });

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        // Infinite loop: go to start if at end
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }

        updateCarousel();
        pauseAutoScroll();
    });
    // Touch event listeners for swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isUserInteracting = true; // Pause auto-scroll on touch
        stopAutoScroll();
    });
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
        // Resume auto-scroll after a delay
        setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 5000);
    });
    function handleSwipeGesture() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right
            if (currentIndex <= 0) {
                currentIndex = maxIndex;
            } else {
                currentIndex--;
            }
            updateCarousel();
        }
    }
    // Pause auto-scroll on hover
    carousel.addEventListener('mouseenter', () => {
        pauseAutoScroll();
    });

    carousel.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startAutoScroll();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            updateCarousel(true);
            startAutoScroll();
        }, 100);
    });

    // Initialize immediately
    updateCarousel(true);
    startAutoScroll();
})();

