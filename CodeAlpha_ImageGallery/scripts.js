// Unsplash API Configuration
const UNSPLASH_ACCESS_KEY = CONFIG.UNSPLASH_ACCESS_KEY;
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
        title: 'Visual Escapes',
        subtitle: 'Discover breathtaking journey through frozen moments and fleeting emotions'
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
    icelens: {
        title: 'Ice Lens',
        subtitle: 'Photographic masterpieces through the lens of winter artists'
    },
    frozenframes: {
        title: 'Your Frozen Frames',
        subtitle: 'Organize and manage your personal collection of ice-themed photographs'
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
    // If clicking the same category, force refresh with new random photos
    if (currentCategory === category) {
        currentPage = 1;
        loadImages(); // This will fetch new random photos for the same category
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
// Load Ice Lens - Stories Behind the Frames
function loadIceLensContent() {
    // Update header content for Ice Lens
    headerTitle.textContent = 'Ice Lens';
    headerSubtitle.textContent = 'Explore the art and science behind capturing frozen moments. Learn from professional photographers and their techniques';
    
    showLoading();
    
    // Load stories with any type of photos that have interesting stories
    loadStoriesBehindFrames();
}

// Load Stories Behind the Frames
async function loadStoriesBehindFrames() {
    try {
        // Search for photos that might have interesting stories
        const queries = [
            'storytelling photography',
            'documentary photography', 
            'photojournalism',
            'conceptual photography',
            'emotional photography',
            'human stories',
            'cultural photography',
            'historical photography'
        ];
        
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(randomQuery)}&per_page=8&orientation=landscape`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stories');
        }

        const data = await response.json();
        
        // Create story cards with fictional stories since Unsplash doesn't provide actual stories
        const storiesHTML = data.results.map((photo, index) => {
            const stories = [
                "This image was captured during a spontaneous road trip when the photographer stumbled upon this scene at golden hour. The play of light and shadow tells a story of fleeting moments and unexpected beauty.",
                "After weeks of planning and waiting for perfect conditions, this shot represents the culmination of patience and vision. Each element in the frame was carefully considered to convey a sense of tranquility.",
                "This photograph emerged from a personal project exploring human connection in urban environments. The candid moment captured reveals the unspoken stories between strangers in a bustling city.",
                "Shot during a humanitarian mission, this image documents resilience and hope in challenging circumstances. The photographer spent days building trust with the community before capturing this authentic moment.",
                "This conceptual piece was created to challenge perceptions of reality. The photographer used multiple exposures and creative lighting to build a narrative that exists between dreams and reality.",
                "From a long-term documentary project, this frame represents a turning point in the story. The composition leads the viewer through a visual journey of transformation and growth.",
                "Captured during a cultural festival that occurs only once every ten years, this photograph preserves a moment of tradition and celebration that few get to witness firsthand.",
                "This experimental shot came from playing with unconventional techniques. The resulting image tells a story of creative freedom and the beauty found in unexpected results."
            ];
            
            const story = stories[index] || stories[0];
            
            return `
                <div class="story-card">
                    <div class="story-image">
                        <img src="${photo.urls.regular}" alt="${photo.alt_description || 'Story photograph'}" loading="lazy">
                        <div class="story-number">${index + 1}</div>
                    </div>
                    <div class="story-content">
                        <h3 class="story-title">The Story Behind This Frame</h3>
                        <div class="photographer-info">
                            <i class="fas fa-camera"></i>
                            <span>By ${photo.user.name}</span>
                        </div>
                        <p class="story-text">${story}</p>
                        <div class="story-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${Math.floor(Math.random() * 12) + 1} hours of work</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-heart"></i>
                                <span>${photo.likes} appreciations</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        imagesGrid.innerHTML = `
            <div class="stories-intro">
                <h3>Professional Photography</h3>
                <p>Explore the art and science behind capturing frozen moments. Learn from professional photographers and their techniques.</p>
            </div>
            <div class="stories-grid">
                ${storiesHTML}
            </div>
        `;
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading stories:', error);
        showError('Failed to load stories. Please try again.');
        hideLoading();
    }
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