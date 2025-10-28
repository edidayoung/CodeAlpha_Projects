// Image Management and Display
class ImageManager {
    static displayImages(images) {
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

        this.attachImageEventListeners();
    }

    static attachImageEventListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageId = btn.getAttribute('data-image-id');
                this.toggleFavorite(imageId, state.currentImages);
            });
        });

        document.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn') && !e.target.closest('.delete-btn')) {
                    const index = parseInt(card.getAttribute('data-index'));
                    Lightbox.open(index);
                }
            });
        });
    }

    static toggleFavorite(imageId, images) {
        const existingIndex = state.favorites.findIndex(fav => fav.id === imageId);
        
        if (existingIndex > -1) {
            state.favorites.splice(existingIndex, 1);
            UIHelpers.showNotification('Removed from favorites', 'success');
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
                UIHelpers.showNotification('Added to favorites!', 'success');
            }
        }

        StorageManager.saveToStorage();
        this.updateFavoriteButtons();
    }

    static updateFavoriteButtons() {
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

    static loadFrozenFrames() {
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
                this.deleteImage(imageId, type);
            });
        });

        // Attach lightbox listeners
        document.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    const index = parseInt(card.getAttribute('data-index'));
                    Lightbox.open(index);
                }
            });
        });
    }

    static deleteImage(imageId, type) {
        if (!confirm('Are you sure you want to remove this image?')) return;

        if (type === 'uploaded') {
            state.uploadedImages = state.uploadedImages.filter(img => img.id !== imageId);
        } else {
            state.favorites = state.favorites.filter(img => img.id !== imageId);
        }

        StorageManager.saveToStorage();
        this.loadFrozenFrames();
        UIHelpers.showNotification('Image removed', 'success');
    }

    static async loadIceLensContent() {
        UIHelpers.showLoading();

        try {
            const images = await ApiService.loadIceLensImages();

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

            const storiesHTML = images.map((photo, index) => `
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
            UIHelpers.hideLoading();
        } catch (error) {
            console.error('Error loading stories:', error);
            UIHelpers.showError('Failed to load stories. Please try again.');
            UIHelpers.hideLoading();
        }
    }

    static handleFileUpload(e) {
        const files = e.target.files;
        if (!files.length) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                UIHelpers.showNotification('Please upload only image files', 'error');
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
                StorageManager.saveToStorage();
                UIHelpers.showNotification('Image uploaded successfully!', 'success');

                if (state.currentPage === 'frozenframes') {
                    this.loadFrozenFrames();
                }
            };
            reader.readAsDataURL(file);
        });

        e.target.value = '';
    }
}