// Albums Data Structure
let userAlbums = {
    favourites: {
        name: 'Favourites',
        description: 'Your favorite ice-themed photos',
        images: [],
        created: new Date().toISOString()
    },
    downloads: {
        name: 'Downloads', 
        description: 'Downloaded glacial wonders',
        images: [],
        created: new Date().toISOString()
    }
};

// Current album state
let currentAlbum = null;

// DOM Elements for albums
const albumsSection = document.getElementById('albumsSection');
const albumsGrid = document.getElementById('albumsGrid');
const albumView = document.getElementById('albumView');
const albumImagesGrid = document.getElementById('albumImagesGrid');
const albumHeader = document.getElementById('albumHeader');
const createAlbumModal = document.getElementById('createAlbumModal');
const albumForm =document.getElementById('albumForm');
const backToAlbumsBtn = document.getElementById('backToAlbums');

// Initialize albums system
function initAlbums() {
    loadAlbumsFromStorage();
    renderAlbumsGrid();
    setupAlbumEventListeners();
}

// Load albums from localStorage
function loadAlbumsFromStorage() {
    const saved = localStorage.getItem('frostframe-albums');
    if (saved) {
        userAlbums = JSON.parse(saved);
    }
}

// Save albums to localStorage
function saveAlbumsToStorage() {
    localStorage.setItem('frostframe-albums', JSON.stringify(userAlbums));
}

// Render albums grid
function renderAlbumsGrid() {
    const albumsHTML = Object.entries(userAlbums).map(([id, album]) => `
        <div class="album-card" data-album-id="${id}">
            <div class="album-icon">
                <i class="fas fa-folder"></i>
            </div>
            <h3>${album.name}</h3>
            <p class="album-count">${album.images.length} photos</p>
        </div>
    `).join('');

    albumsGrid.innerHTML = albumsHTML + `
        <div class="create-album-section">
            <button class="create-album-btn" id="createAlbumBtn">
                <i class="fas fa-plus"></i>
                Create New Album
            </button>
        </div>
    `;
}

// Setup event listeners for albums
function setupAlbumEventListeners() {
    // Album card clicks
    document.addEventListener('click', function(e) {
        const albumCard = e.target.closest('.album-card');
        if (albumCard && albumCard.dataset.albumId) {
            openAlbum(albumCard.dataset.albumId);
        }
    });

    // Create album button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'createAlbumBtn' || e.target.closest('#createAlbumBtn')) {
            openCreateAlbumModal();
        }
    });

    // Modal close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('album-modal')) {
            closeCreateAlbumModal();
        }
    });

    // Back to albums
    if (backToAlbumsBtn) {
        backToAlbumsBtn.addEventListener('click', showAlbumsGrid);
    }

    // Album form submission
    if (albumForm) {
        albumForm.addEventListener('submit', createNewAlbum);
    }
}

// Open album view
function openAlbum(albumId) {
    currentAlbum = albumId;
    const album = userAlbums[albumId];
    
    // Update album header
    albumHeader.innerHTML = `
        <h2>${album.name}</h2>
        <p>${album.description}</p>
    `;
    
    // Render album images
    renderAlbumImages();
    
    // Show album view, hide grid
    albumsGrid.style.display = 'none';
    albumView.classList.add('active');
}

// Render images in current album
function renderAlbumImages() {
    const album = userAlbums[currentAlbum];
    
    if (album.images.length === 0) {
        albumImagesGrid.innerHTML = `
            <div class="empty-album">
                <i class="fas fa-images"></i>
                <h3>No Photos Yet</h3>
                <p>This album is empty. Add some photos to get started!</p>
            </div>
        `;
    } else {
        const imagesHTML = album.images.map(image => `
            <div class="image-card">
                <img src="${image.url}" alt="${image.description || 'Album photo'}" loading="lazy">
                <div class="image-overlay">
                    <div class="image-author">${image.author || 'Your photo'}</div>
                    ${image.description ? `<div class="image-description">${image.description}</div>` : ''}
                </div>
            </div>
        `).join('');
        
        albumImagesGrid.innerHTML = imagesHTML;
    }
}

// Show albums grid
function showAlbumsGrid() {
    albumView.classList.remove('active');
    albumsGrid.style.display = 'grid';
    currentAlbum = null;
    renderAlbumsGrid();
}

// Open create album modal
function openCreateAlbumModal() {
    createAlbumModal.classList.add('active');
    document.getElementById('albumName').focus();
}

// Close create album modal
function closeCreateAlbumModal() {
    createAlbumModal.classList.remove('active');
    albumForm.reset();
}

// Create new album
function createNewAlbum(e) {
    e.preventDefault();
    
    const albumName = document.getElementById('albumName').value.trim();
    const albumDescription = document.getElementById('albumDescription').value.trim();
    
    if (!albumName) {
        alert('Please enter an album name');
        return;
    }
    
    // Generate unique ID
    const albumId = 'album_' + Date.now();
    
    // Create new album
    userAlbums[albumId] = {
        name: albumName,
        description: albumDescription || 'Your personal photo collection',
        images: [],
        created: new Date().toISOString()
    };
    
    // Save and update UI
    saveAlbumsToStorage();
    renderAlbumsGrid();
    closeCreateAlbumModal();
    
    // Optional: Auto-open the new album
    // openAlbum(albumId);
}

// Add image to album (you can call this from main JS later)
function addImageToAlbum(albumId, imageData) {
    if (userAlbums[albumId]) {
        userAlbums[albumId].images.push(imageData);
        saveAlbumsToStorage();
        
        // If currently viewing this album, update the view
        if (currentAlbum === albumId) {
            renderAlbumImages();
        }
        
        // Update albums grid count
        renderAlbumsGrid();
    }
}

// Remove image from album
function removeImageFromAlbum(albumId, imageIndex) {
    if (userAlbums[albumId] && userAlbums[albumId].images[imageIndex]) {
        userAlbums[albumId].images.splice(imageIndex, 1);
        saveAlbumsToStorage();
        
        if (currentAlbum === albumId) {
            renderAlbumImages();
        }
        
        renderAlbumsGrid();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAlbums);