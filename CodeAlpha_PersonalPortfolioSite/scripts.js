// Mobile menu toggle functionality
const menuIcon = document.querySelector('.fa-bars');
const closeIcon = document.querySelector('.fa-xmark');
const navLinks = document.querySelector('.nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.style.right = "0";
});

closeIcon.addEventListener('click', () => {
    navLinks.style.right = "-200px";
});

// Close menu when clicking on links
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.style.right = "-200px";
    });
});