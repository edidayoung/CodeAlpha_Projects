// Unsplash API Configuration
const UNSPLASH_ACCESS_KEY = '2U2TjasTJwi1mL4-8Xeh211qJ93CIbh-UsFL5w0F7zQ';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// DOM Elements
const imagesGrid = document.getElementById('imagesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const headerTitle = document.querySelector('.header-title');
const headerSubtitle = document.querySelector('.header-subtitle');

// State
let currentPage = 1;
let currentQuery = '';
let currentCategory = '';
let isLoading = false;

// Page content configurations
const pageContent = {
    explore: {
        title: 'Glacial Explorations',
        subtitle: 'Discover breathtaking glacial landscapes and icy wonders from around the world'
    },
    collections: {
        title: 'Ice Collections',
        subtitle: 'Curated collections of stunning frozen moments and winter beauty'
    },
    beauty: {
        title: 'Beauty Collection',
        subtitle: 'Captivating images that showcase the elegance and beauty of ice'
    },
    nature: {
        title: 'Nature Collection',
        subtitle: 'The raw power and serenity of nature\'s frozen wonders'
    },
    people: {
        title: 'People Collection',
        subtitle: 'Human experiences and stories in icy environments'
    },
    lifestyle: {
        title: 'Lifestyle Collection',
        subtitle: 'Daily life and activities in winter wonderlands'
    },
    iceLens: {
        title: 'Ice Lens',
        subtitle: 'Photographic masterpieces through the lens of winter artists'
    },
    frozenFrames: {
        title: 'Frozen Frames',
        subtitle: 'Your personal gallery of captured icy moments and memories'
    }
};

// Initialize the gallery
document.addEventListener('DOMContentLoaded', function() {
    createSnowfall();
    loadImages();
    
    // Load more button event listener
    loadMoreBtn.addEventListener('click', loadMoreImages);
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this.textContent.toLowerCase());
        });
    });

    // Dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.toLowerCase();
            handleCategoryClick(category);
        });
    });

    // Frozen Frames special link
    const specialLink = document.querySelector('.special-link');
    specialLink.addEventListener('click', function(e) {
        e.preventDefault();
        handleNavigation('frozen frames');
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// Handle navigation clicks
function handleNavigation(navItem) {
    // Update active state - find and activate the clicked nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent.toLowerCase() === navItem) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Set current page content
    let pageKey = navItem.toLowerCase().replace(' ', '');
    
    if (pageContent[pageKey]) {
        headerTitle.textContent = pageContent[pageKey].title;
        headerSubtitle.textContent = pageContent[pageKey].subtitle;
    }
    
    // Reset and load appropriate content
    currentPage = 1;
    currentQuery = '';
    currentCategory = '';
    
    if (navItem === 'explore') {
        loadImages(); // Random images
    } else if (navItem === 'ice lens') {
        // Ice Lens specific functionality - ADD THIS NEW FUNCTION
        loadIceLensContent();
    } else if (navItem === 'frozen frames') {
        // Placeholder for user uploads
        showUserUploadsPlaceholder();
    } else if (navItem === 'collections') {
        // Load general winter images for collections overview
        currentQuery = 'winter collection';
        loadImages();
    }
}

// Handle category clicks with refresh functionality
function handleCategoryClick(category) {
    // If clicking the same category, force refresh with new photos
    if (currentCategory === category) {
        currentPage = 1;
        // Force new query to get different results
        currentQuery = category + ' ' + Date.now();
        loadImages();
        return;
    }
    
    // New category selected
    currentCategory = category;
    currentPage = 1;
    currentQuery = category;
    
    // Update header content
    if (pageContent[category]) {
        headerTitle.textContent = pageContent[category].title;
        headerSubtitle.textContent = pageContent[category].subtitle;
    }
    
    loadImages();
}

// Load Ice Lens specialized educational content
function loadIceLensContent() {
    showLoading();
    
    // Simulate loading
    setTimeout(() => {
        const iceLensHTML = `
            <div class="ice-lens-intro">
                <h3>Professional Winter Photography</h3>
                <p>Explore the art and science behind capturing frozen moments. Learn from professional photographers and their techniques.</p>
            </div>
            
            <div class="educational-tips">
                <div class="tip-card">
                    <i class="fas fa-camera"></i>
                    <h4>Camera Settings for Snow</h4>
                    <p>Use exposure compensation (+1 to +2) to prevent snow from looking gray. Shoot in RAW for better post-processing.</p>
                </div>
                <div class="tip-card">
                    <i class="fas fa-sun"></i>
                    <h4>Golden Hour Magic</h4>
                    <p>Winter golden hour creates stunning pink and blue tones on ice. Plan shoots around sunrise/sunset.</p>
                </div>
                <div class="tip-card">
                    <i class="fas fa-hands"></i>
                    <h4>Gear Protection</h4>
                    <p>Keep equipment in sealed bags when moving between temperatures to prevent condensation damage.</p>
                </div>
            </div>
        `;
        
        imagesGrid.innerHTML = iceLensHTML;
        
        // Load professional winter photos
        loadProfessionalWinterPhotos();
        
    }, 1000);
}

// Load professional photos for Ice Lens
async function loadProfessionalWinterPhotos() {
    try {
        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?query=professional winter photography landscape&per_page=9&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            const photosHTML = data.results.map(photo => `
                <div class="image-card professional-card">
                    <img src="${photo.urls.regular}" alt="${photo.alt_description || 'Professional winter photo'}" loading="lazy">
                    <div class="image-overlay">
                        <div class="image-author">
                            📷 ${photo.user.name}
                        </div>
                        <div class="image-description">${photo.description || 'Professional winter photography'}</div>
                    </div>
                </div>
            `).join('');
            
            imagesGrid.innerHTML += `
                <div class="professional-grid">
                    <h3>Featured Winter Photography</h3>
                    <div class="images-grid">
                        ${photosHTML}
                    </div>
                </div>
            `;
        }
        hideLoading();
    } catch (error) {
        console.error('Error loading professional photos:', error);
        hideLoading();
    }
}

// Load images from Unsplash
async function loadImages() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
        let url;
        
        if (currentQuery) {
            // Search for specific query with random seed for variety
            const randomSeed = Date.now(); // Add timestamp to get different results
            url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(currentQuery)}&page=${currentPage}&per_page=12&orientation=landscape`;
        } else {
            // Get random photos
            url = `${UNSPLASH_API_URL}/photos/random?count=12&orientation=landscape`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const data = await response.json();
        const images = currentQuery ? data.results : data;
        
        if (currentPage === 1) {
            imagesGrid.innerHTML = '';
        }
        
        displayImages(images);
        
        // Show load more button for search results
        if (currentQuery && data.total_pages > currentPage) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error loading images:', error);
        showError('Failed to load images. Please try again later.');
    } finally {
        hideLoading();
        isLoading = false;
    }
}

// Perform search
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        currentQuery = query;
        currentCategory = '';
        currentPage = 1;
        headerTitle.textContent = `Search: ${query}`;
        headerSubtitle.textContent = `Discover images related to "${query}"`;
        loadImages();
    }
}

// Load more images
function loadMoreImages() {
    currentPage++;
    loadImages();
}

// Display images in the grid
function displayImages(images) {
    if (!images || images.length === 0) {
        imagesGrid.innerHTML = '<p class="no-images">No images found. Try a different search.</p>';
        return;
    }

    const imagesHTML = images.map(image => `
        <div class="image-card">
            <img 
                src="${image.urls.regular}" 
                alt="${image.alt_description || 'Beautiful image'}"
                loading="lazy"
            >
            <div class="image-overlay">
                <div class="image-author">
                    Photo by <a href="${image.user.links.html}?utm_source=FrostFrame&utm_medium=referral" target="_blank">${image.user.name}</a>
                </div>
                ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
            </div>
        </div>
    `).join('');

    if (currentPage === 1) {
        imagesGrid.innerHTML = imagesHTML;
    } else {
        imagesGrid.innerHTML += imagesHTML;
    }
}

// Placeholder for user uploads (Frozen Frames)
function showUserUploadsPlaceholder() {
    imagesGrid.innerHTML = `
        <div class="user-uploads-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <h3>Your Frozen Frames</h3>
            <p>Upload and manage your personal ice-themed photos here</p>
            <button class="upload-btn">Upload Photos</button>
        </div>
    `;
    
    // Add some CSS for the placeholder (you can move this to CSS file)
    const style = document.createElement('style');
    style.textContent = `
        .user-uploads-placeholder {
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-gray);
        }
        
        .user-uploads-placeholder i {
            font-size: 4rem;
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        .user-uploads-placeholder h3 {
            color: var(--text-light);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .upload-btn {
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: var(--primary);
            color: var(--bg-dark);
            border: none;
            border-radius: 25px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .upload-btn:hover {
            background: var(--accent);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Snowfall Generator
function createSnowfall() {
    const snowContainer = document.getElementById('snowContainer');
    const snowflakes = ['❅', '❆', '•'];
    
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        const size = Math.random() * 1.2 + 0.5;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        snowflake.style.fontSize = `${size}rem`;
        snowflake.style.left = `${left}%`;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;
        
        snowContainer.appendChild(snowflake);
    }
}

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'block';
    loadMoreBtn.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Show error message
function showError(message) {
    imagesGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}












