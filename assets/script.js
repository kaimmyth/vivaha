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

// Form submission
function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you for your RSVP! We will contact you soon with more details.');
    e.target.reset();
}

// Gallery click to view
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const bgImage = window.getComputedStyle(this).backgroundImage;
        const url = bgImage.slice(5, -2);
        window.open(url, '_blank');
    });
});

// Countdown to wedding: 30 Nov 2025 10:30 (local time)
(function() {
    const target = new Date(2025, 10, 30, 10, 30, 0); // month is 0-indexed: 10 -> November
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function pad(n){ return String(n).padStart(2, '0'); }

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

    function setIfChanged(el, value){
        if(!el) return;
        const old = el.textContent;
        const newVal = String(value);
        if(old !== newVal){
            el.textContent = newVal;
            const parent = el.parentElement;
            if(parent){
                parent.classList.remove('update');
                void parent.offsetWidth; // force reflow
                parent.classList.add('update');
                setTimeout(()=> parent.classList.remove('update'), 600);
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
(function() {
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
    themeToggle.addEventListener('click', function() {
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

