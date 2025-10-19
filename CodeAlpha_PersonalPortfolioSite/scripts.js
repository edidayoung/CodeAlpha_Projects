window.addEventListener('load', function() {
    // Remove hash from URL without triggering scroll
    history.replaceState(null, null, ' ');
    // Then scroll to top
    window.scrollTo(0, 0);
});
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

     // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if click is outside the nav menu and menu is open
        if (!navLinks.contains(e.target) && 
            !menuIcon.contains(e.target) && 
            navLinks.style.right === "0px") {
            navLinks.style.right = "-200px";
        }
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
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.bio-card')) {
            cards.forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
});

// Skill bars that fill when hovering the entire card
function initializeSkillBars() {
  const skillCategories = document.querySelectorAll('.skill-category');
  
  skillCategories.forEach(category => {
    const progressBars = category.querySelectorAll('.skill-progress');
    const percentTexts = category.querySelectorAll('.skill-percent');
    
    // Store target widths for each progress bar in the category
    progressBars.forEach((bar, index) => {
      const targetLevel = bar.getAttribute('data-level');
      bar.style.setProperty('--target-width', targetLevel + '%');
      
      // Hover event for entire category
      category.addEventListener('mouseenter', () => {
        bar.style.width = targetLevel + '%';
        percentTexts[index].textContent = targetLevel + '%';
      });
      
      // Mouse leave to reset
      category.addEventListener('mouseleave', () => {
        bar.style.width = '0%';
        percentTexts[index].textContent = '0%';
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeSkillBars);