// Main Application Initialization
class FrostFrameApp {
    static init() {
        // Load data from storage
        StorageManager.loadFromStorage();
        
        // Initialize all components
        UIHelpers.createSnowfall();
        Navigation.init();
        Lightbox.init();
        
        // Load initial images
        ApiService.loadImages();
        
        // Setup remaining event listeners
        this.setupEventListeners();
        
        // Handle window resize
        this.setupResizeHandler();
    }

    static setupEventListeners() {
        // Load more button
        elements.loadMoreBtn.addEventListener('click', () => this.loadMoreImages());
        
        // File upload
        elements.fileInput.addEventListener('change', (e) => ImageManager.handleFileUpload(e));
        
        // Mobile menu toggle
        elements.mobileMenuToggle.addEventListener('click', () => Navigation.toggleMobileMenu());
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    static setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 968) {
                    Navigation.closeMobileMenu();
                }
            }, 250);
        });
    }

    static loadMoreImages() {
        state.pageNumber++;
        ApiService.loadImages(state.currentQuery, state.pageNumber);
    }

    static handleResize() {
        if (window.innerWidth > 968) {
            Navigation.closeMobileMenu();
            elements.collectionsDropdown.classList.remove('mobile-active');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FrostFrameApp.init();
});