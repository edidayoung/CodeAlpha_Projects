// Mobile menu toggle functionality
const menuIcon = document.querySelector('.fa-bars');
const closeIcon = document.querySelector('.fa-xmark');
const navLinks = document.querySelector('.nav-links');

if (menuIcon && closeIcon && navLinks) {
    menuIcon.addEventListener('click', () => {
        navLinks.style.right = "0";
    });

    closeIcon.addEventListener('click', () => {
        navLinks.style.right = "-200px";
    });

    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.style.right = "-200px";
        });
    });
}

// 3D Card Flip Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.bio-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('flipped');
        });
    });

    // Close cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.bio-card')) {
            cards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
});