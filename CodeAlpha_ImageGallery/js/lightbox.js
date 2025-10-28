// Lightbox Functionality
class Lightbox {
    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        elements.lightboxClose.addEventListener('click', () => this.close());
        elements.lightboxPrev.addEventListener('click', () => this.showPrevImage());
        elements.lightboxNext.addEventListener('click', () => this.showNextImage());
        
        elements.lightbox.addEventListener('click', (e) => {
            if (e.target === elements.lightbox) this.close();
        });

        // Show lightbox info on interaction
        elements.lightbox.addEventListener('mousemove', () => this.showInfo());
        elements.lightbox.addEventListener('touchstart', () => this.showInfo());
        elements.lightboxImage.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showInfo();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!elements.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape': this.close(); break;
                case 'ArrowLeft': this.showPrevImage(); break;
                case 'ArrowRight': this.showNextImage(); break;
            }
        });
    }

    static open(index) {
        state.lightboxIndex = index;
        this.updateContent();
        elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.showInfo();
    }

    static close() {
        elements.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        elements.lightboxInfo.classList.remove('hidden');
        
        // Clear timeout
        if (state.lightboxInfoTimeout) {
            clearTimeout(state.lightboxInfoTimeout);
            state.lightboxInfoTimeout = null;
        }
    }

    static showInfo() {
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

    static showPrevImage() {
        if (state.lightboxIndex > 0) {
            state.lightboxIndex--;
            this.updateContent();
            this.showInfo();
        }
    }

    static showNextImage() {
        if (state.lightboxIndex < state.currentImages.length - 1) {
            state.lightboxIndex++;
            this.updateContent();
            this.showInfo();
        }
    }

    static updateContent() {
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
}