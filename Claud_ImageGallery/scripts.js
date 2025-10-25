// Configuration
const UNSPLASH_ACCESS_KEY = 'ODfmoCjUgpIJd7qO0lwvpSTfmMNamtEFkRYOmaQdv5I';
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const CACHE_DURATION = 3600000;
const STORAGE_KEYS = {
  FAVORITES: 'frostframe_favorites',
  UPLOADED: 'frostframe_uploaded',
  IMAGE_CACHE: 'frostframe_cache',
  LAST_FETCH: 'frostframe_last_fetch'
};

// State management
const state = {
  currentPage: 'explore',
  currentCategory: '',
  currentQuery: '',
  pageNumber: 1,
  isLoading: false,
  cachedImages: {},
  favorites: [],
  uploadedImages: [],
  currentImages: [],
  lightboxIndex: 0,
  lightboxInfoTimeout: null
};

// Page configurations
const pageContent = {
  explore: {
    title: 'Visual Escapes',
    subtitle: 'Discover breathtaking journey through frozen moments and fleeting emotions'
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
    subtitle: 'Explore the art and science behind capturing frozen moments'
  },
  frozenframes: {
    title: 'Your Frozen Frames',
    subtitle: 'Your personal collection of favorite and uploaded images'
  }
};

// DOM Elements
const elements = {
  imagesGrid: document.getElementById('imagesGrid'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  headerTitle: document.querySelector('.header-title'),
  headerSubtitle: document.querySelector('.header-subtitle'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-btn'),
  fileInput: document.getElementById('fileInput'),
  mobileMenuToggle: document.getElementById('mobileMenuToggle'),
  navMenu: document.getElementById('navMenu'),
  collectionsDropdown: document.getElementById('collectionsDropdown'),
  lightbox: document.getElementById('lightbox'),
  lightboxImage: document.getElementById('lightboxImage'),
  lightboxClose: document.getElementById('lightboxClose'),
  lightboxPrev: document.getElementById('lightboxPrev'),
  lightboxNext: document.getElementById('lightboxNext'),
  lightboxInfo: document.getElementById('lightboxInfo'),
  lightboxCounter: document.getElementById('lightboxCounter')
};

// Initialize app
function init() {
  loadFromStorage();
  createSnowfall();
  loadImages();
  setupEventListeners();
}

// Setup all event listeners
function setupEventListeners() {
  // Mobile menu toggle
  elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Navigation links
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      handleNavigation(page);
      closeMobileMenu();
    });
  });

  // Special link
  document.querySelector('.special-link').addEventListener('click', (e) => {
    e.preventDefault();
    handleNavigation('frozenframes');
    closeMobileMenu();
  });

  // Dropdown categories
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const category = item.getAttribute('data-category');
      handleCategoryClick(category);
      closeMobileMenu();
    });
  });

  // Mobile dropdown toggle
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  dropdownToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 968) {
      e.preventDefault();
      e.stopPropagation();
      elements.collectionsDropdown.classList.toggle('mobile-active');
    }
  });

  // Search
  elements.searchBtn.addEventListener('click', performSearch);
  elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // Load more
  elements.loadMoreBtn.addEventListener('click', loadMoreImages);

  // File input
  elements.fileInput.addEventListener('change', handleFileUpload);

  // Lightbox controls
  elements.lightboxClose.addEventListener('click', closeLightbox);
  elements.lightboxPrev.addEventListener('click', showPrevImage);
  elements.lightboxNext.addEventListener('click', showNextImage);
  elements.lightbox.addEventListener('click', (e) => {
    if (e.target === elements.lightbox) closeLightbox();
  });

  // Show lightbox info on mouse move or touch
  elements.lightbox.addEventListener('mousemove', showLightboxInfo);
  elements.lightbox.addEventListener('touchstart', showLightboxInfo);
  elements.lightboxImage.addEventListener('click', (e) => {
    e.stopPropagation();
    showLightboxInfo();
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!elements.lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 968 && 
        !elements.navMenu.contains(e.target) && 
        !elements.mobileMenuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 968) {
      closeMobileMenu();
      elements.collectionsDropdown.classList.remove('mobile-active');
    }
  });
}

// Mobile menu functions
function toggleMobileMenu() {
  elements.navMenu.classList.toggle('active');
  const icon = elements.mobileMenuToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-times');
}

function closeMobileMenu() {
  if (window.innerWidth <= 968) {
    elements.navMenu.classList.remove('active');
    const icon = elements.mobileMenuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    elements.collectionsDropdown.classList.remove('mobile-active');
  }
}

// Handle navigation
function handleNavigation(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
    }
  });

  state.currentPage = page;
  state.pageNumber = 1;
  state.currentQuery = '';
  state.currentCategory = '';

  updateHeaderContent(page);

  if (page === 'explore') {
    loadImages();
  } else if (page === 'icelens') {
    loadIceLensContent();
  } else if (page === 'frozenframes') {
    loadFrozenFrames();
  }
}

// Handle category clicks
function handleCategoryClick(category) {
  state.currentCategory = category;
  state.currentPage = category;
  state.pageNumber = 1;
  state.currentQuery = category;

  updateHeaderContent(category);
  loadImages();
}

// Update header content
function updateHeaderContent(page) {
  const content = pageContent[page] || pageContent.explore;
  elements.headerTitle.textContent = content.title;
  elements.headerSubtitle.textContent = content.subtitle;
}

// Perform search
function performSearch() {
  const query = elements.searchInput.value.trim();
  if (!query) return;

  state.currentQuery = query;
  state.currentCategory = '';
  state.pageNumber = 1;
  elements.headerTitle.textContent = `Search: ${query}`;
  elements.headerSubtitle.textContent = `Discover images related to "${query}"`;
  loadImages();
  closeMobileMenu();
}

// Load images with caching
async function loadImages() {
  if (state.isLoading) return;

  state.isLoading = true;
  showLoading();

  try {
    const cacheKey = `${state.currentQuery || 'random'}_${state.pageNumber}`;
    const now = Date.now();
    const lastFetch = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_FETCH) || '0');

    if (!state.currentQuery && state.pageNumber === 1 && (now - lastFetch) < CACHE_DURATION) {
      const cached = state.cachedImages[cacheKey];
      if (cached) {
        displayImages(cached);
        hideLoading();
        state.isLoading = false;
        return;
      }
    }

    let url;
    if (state.currentQuery) {
      url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(state.currentQuery)}&page=${state.pageNumber}&per_page=12&orientation=landscape`;
    } else {
      url = `${UNSPLASH_API_URL}/photos/random?count=12&orientation=landscape`;
    }

    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const images = state.currentQuery ? data.results : data;

    if (!state.currentQuery && state.pageNumber === 1) {
      state.cachedImages[cacheKey] = images;
      localStorage.setItem(STORAGE_KEYS.LAST_FETCH, now.toString());
    }

    displayImages(images);

    if (state.currentQuery && data.total_pages > state.pageNumber) {
      elements.loadMoreBtn.style.display = 'block';
    } else {
      elements.loadMoreBtn.style.display = 'none';
    }

  } catch (error) {
    console.error('Error loading images:', error);
    showError('Failed to load images. Please try again later.');
  } finally {
    hideLoading();
    state.isLoading = false;
  }
}

// Load more images
function loadMoreImages() {
  state.pageNumber++;
  loadImages();
}

// Display images
function displayImages(images) {
  if (!images || images.length === 0) {
    elements.imagesGrid.innerHTML = '<p class="no-images">No images found. Try a different search.</p>';
    return;
  }

  const imagesHTML = images.map((image, index) => {
    const isFavorited = state.favorites.some(fav => fav.id === image.id);
    return `
      <div class="image-card" data-image-id="${image.id}" data-index="${state.pageNumber === 1 ? index : state.currentImages.length + index}">
        <img src="${image.urls.regular}" alt="${image.alt_description || 'Beautiful image'}" loading="lazy">
        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-image-id="${image.id}">
          <i class="fas fa-heart"></i>
        </button>
        <div class="image-overlay">
          <div class="image-author">
            Photo by <a href="${image.user.links.html}?utm_source=FrostFrame&utm_medium=referral" target="_blank">${image.user.name}</a>
          </div>
          ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (state.pageNumber === 1) {
    elements.imagesGrid.innerHTML = imagesHTML;
    state.currentImages = images;
  } else {
    elements.imagesGrid.innerHTML += imagesHTML;
    state.currentImages = [...state.currentImages, ...images];
  }

  attachImageEventListeners();
}

// Attach event listeners to images
function attachImageEventListeners() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imageId = btn.getAttribute('data-image-id');
      toggleFavorite(imageId, state.currentImages);
    });
  });

  document.querySelectorAll('.image-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.favorite-btn') && !e.target.closest('.delete-btn')) {
        const index = parseInt(card.getAttribute('data-index'));
        openLightbox(index);
      }
    });
  });
}

// Lightbox functions
function openLightbox(index) {
  state.lightboxIndex = index;
  updateLightboxContent();
  elements.lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Show info initially, then hide after 3 seconds
  showLightboxInfo();
}

function closeLightbox() {
  elements.lightbox.classList.remove('active');
  document.body.style.overflow = '';
  elements.lightboxInfo.classList.remove('hidden');
  
  // Clear timeout
  if (state.lightboxInfoTimeout) {
    clearTimeout(state.lightboxInfoTimeout);
    state.lightboxInfoTimeout = null;
  }
}

function showLightboxInfo() {
  // Clear existing timeout
  if (state.lightboxInfoTimeout) {
    clearTimeout(state.lightboxInfoTimeout);
  }

  // Show the info
  elements.lightboxInfo.classList.remove('hidden');

  // Hide after 3 seconds
  state.lightboxInfoTimeout = setTimeout(() => {
    elements.lightboxInfo.classList.add('hidden');
  }, 3000);
}

function showPrevImage() {
  if (state.lightboxIndex > 0) {
    state.lightboxIndex--;
    updateLightboxContent();
    showLightboxInfo();
  }
}

function showNextImage() {
  if (state.lightboxIndex < state.currentImages.length - 1) {
    state.lightboxIndex++;
    updateLightboxContent();
    showLightboxInfo();
  }
}

function updateLightboxContent() {
  const image = state.currentImages[state.lightboxIndex];
  if (!image) return;

  elements.lightboxImage.src = image.url || image.urls.regular;
  elements.lightboxImage.alt = image.description || image.alt_description || 'Image';
  
  const authorHTML = image.author ? 
    `Photo by ${image.author}` : 
    `Photo by <a href="${image.user.links.html}?utm_source=FrostFrame&utm_medium=referral" target="_blank">${image.user.name}</a>`;
  
  elements.lightboxInfo.querySelector('.lightbox-author').innerHTML = authorHTML;
  elements.lightboxInfo.querySelector('.lightbox-description').textContent = 
    image.description || image.alt_description || '';
  
  elements.lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.currentImages.length}`;

  // Show/hide navigation buttons
  elements.lightboxPrev.style.display = state.lightboxIndex === 0 ? 'none' : 'flex';
  elements.lightboxNext.style.display = state.lightboxIndex === state.currentImages.length - 1 ? 'none' : 'flex';
}

// Toggle favorite
function toggleFavorite(imageId, images) {
  const existingIndex = state.favorites.findIndex(fav => fav.id === imageId);
  
  if (existingIndex > -1) {
    state.favorites.splice(existingIndex, 1);
    showNotification('Removed from favorites', 'success');
  } else {
    const image = images.find(img => img.id === imageId);
    if (image) {
      state.favorites.push({
        id: image.id,
        url: image.urls.regular,
        author: image.user.name,
        authorLink: image.user.links.html,
        description: image.description || image.alt_description || 'Beautiful image',
        timestamp: Date.now()
      });
      showNotification('Added to favorites!', 'success');
    }
  }

  saveToStorage();
  updateFavoriteButtons();
}

// Update favorite buttons
function updateFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const imageId = btn.getAttribute('data-image-id');
    const isFavorited = state.favorites.some(fav => fav.id === imageId);
    
    if (isFavorited) {
      btn.classList.add('favorited');
    } else {
      btn.classList.remove('favorited');
    }
  });
}

// Load Frozen Frames page
function loadFrozenFrames() {
  const allImages = [...state.favorites, ...state.uploadedImages];

  // Hide load more button on Frozen Frames
  elements.loadMoreBtn.style.display = 'none';

  if (allImages.length === 0) {
    elements.imagesGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-images"></i>
        <h3>No Images Yet</h3>
        <p>Start building your collection by adding favorites or uploading your own images</p>
        <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
          <i class="fas fa-cloud-upload-alt"></i>
          Upload Images
        </button>
      </div>
    `;
    state.currentImages = [];
    return;
  }

  const imagesHTML = allImages.map((image, index) => {
    const isUploaded = image.type === 'uploaded';
    return `
      <div class="image-card" data-image-id="${image.id}" data-index="${index}">
        <img src="${image.url}" alt="${image.description || 'Your image'}" loading="lazy">
        <button class="delete-btn" data-image-id="${image.id}" data-type="${isUploaded ? 'uploaded' : 'favorite'}">
          <i class="fas fa-trash"></i>
        </button>
        <div class="image-overlay">
          <div class="image-author">
            ${isUploaded ? 'Uploaded by you' : `Photo by ${image.author}`}
          </div>
          ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  elements.imagesGrid.innerHTML = `
    <div class="empty-state" style="padding: 2rem;">
      <h3 style="margin-bottom: 1rem;">Your Collection (${allImages.length} images)</h3>
      <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
        <i class="fas fa-cloud-upload-alt"></i>
        Upload More Images
      </button>
    </div>
    ${imagesHTML}
  `;

  state.currentImages = allImages;

  // Attach delete button listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imageId = btn.getAttribute('data-image-id');
      const type = btn.getAttribute('data-type');
      deleteImage(imageId, type);
    });
  });

  // Attach lightbox listeners
  document.querySelectorAll('.image-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.delete-btn')) {
        const index = parseInt(card.getAttribute('data-index'));
        openLightbox(index);
      }
    });
  });
}

// Delete image
function deleteImage(imageId, type) {
  if (!confirm('Are you sure you want to remove this image?')) return;

  if (type === 'uploaded') {
    state.uploadedImages = state.uploadedImages.filter(img => img.id !== imageId);
  } else {
    state.favorites = state.favorites.filter(img => img.id !== imageId);
  }

  saveToStorage();
  loadFrozenFrames();
  showNotification('Image removed', 'success');
}

// Handle file upload
function handleFileUpload(e) {
  const files = e.target.files;
  if (!files.length) return;

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload only image files', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = {
        id: 'uploaded_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        url: event.target.result,
        author: 'You',
        description: file.name,
        timestamp: Date.now(),
        type: 'uploaded'
      };

      state.uploadedImages.push(imageData);
      saveToStorage();
      showNotification('Image uploaded successfully!', 'success');

      if (state.currentPage === 'frozenframes') {
        loadFrozenFrames();
      }
    };
    reader.readAsDataURL(file);
  });

  e.target.value = '';
}

// Load Ice Lens content
async function loadIceLensContent() {
  showLoading();

  try {
    const queries = [
      'storytelling photography',
      'documentary photography',
      'photojournalism',
      'conceptual photography',
      'emotional photography',
      'cultural photography'
    ];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(randomQuery)}&per_page=8&orientation=landscape`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    });

    if (!response.ok) throw new Error('Failed to fetch stories');

    const data = await response.json();

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

    const storiesHTML = data.results.map((photo, index) => `
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
          <p class="story-text">${stories[index] || stories[0]}</p>
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
    `).join('');

    elements.imagesGrid.innerHTML = `
      <div class="stories-intro">
        <h3>Professional Photography</h3>
        <p>Explore the art and science behind capturing frozen moments. Learn from professional photographers and their techniques.</p>
      </div>
      <div class="stories-grid">
        ${storiesHTML}
      </div>
    `;

    // Hide load more button for Ice Lens
    elements.loadMoreBtn.style.display = 'none';
    state.currentImages = [];
    hideLoading();
  } catch (error) {
    console.error('Error loading stories:', error);
    showError('Failed to load stories. Please try again.');
    hideLoading();
  }
}

// Storage functions
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    localStorage.setItem(STORAGE_KEYS.UPLOADED, JSON.stringify(state.uploadedImages));
  } catch (error) {
    console.error('Error saving to storage:', error);
    showNotification('Failed to save. Storage might be full.', 'error');
  }
}

function loadFromStorage() {
  try {
    const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const uploaded = localStorage.getItem(STORAGE_KEYS.UPLOADED);

    state.favorites = favorites ? JSON.parse(favorites) : [];
    state.uploadedImages = uploaded ? JSON.parse(uploaded) : [];
  } catch (error) {
    console.error('Error loading from storage:', error);
    state.favorites = [];
    state.uploadedImages = [];
  }
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Snowfall
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

// UI helpers
function showLoading() {
  elements.loadingSpinner.style.display = 'block';
  elements.loadMoreBtn.style.display = 'none';
}

function hideLoading() {
  elements.loadingSpinner.style.display = 'none';
}

function showError(message) {
  elements.imagesGrid.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
    </div>
  `;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth > 968) {
      closeMobileMenu();
    }
  }, 250);
});