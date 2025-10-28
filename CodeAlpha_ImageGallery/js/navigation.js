// Navigation and Routing
class Navigation {
    static init() {
        this.setupNavigationListeners();
        this.setupSearchListeners();
        this.setupMobileMenu();
    }

    static setupNavigationListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.handleNavigation(page);
                this.closeMobileMenu();
            });
        });

        // Special link
        document.querySelector('.special-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleNavigation('frozenframes');
            this.closeMobileMenu();
        });

        // Dropdown categories
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.getAttribute('data-category');
                this.handleCategoryClick(category);
                this.closeMobileMenu();
            });
        });
    }

    static setupSearchListeners() {
        elements.searchBtn.addEventListener('click', () => this.performSearch());
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
    }

    static setupMobileMenu() {
        // Mobile dropdown toggle
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                e.stopPropagation();
                elements.collectionsDropdown.classList.toggle('mobile-active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 968 && 
                !elements.navMenu.contains(e.target) && 
                !elements.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    static handleNavigation(page) {
        // Update active navigation state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        // Update application state
        state.currentPage = page;
        state.pageNumber = 1;
        state.currentQuery = '';
        state.currentCategory = '';

        this.updateHeaderContent(page);

        // Load appropriate content
        switch(page) {
            case 'explore':
                ApiService.loadImages();
                break;
            case 'icelens':
                ImageManager.loadIceLensContent();
                break;
            case 'frozenframes':
                ImageManager.loadFrozenFrames();
                break;
        }
    }

    static handleCategoryClick(category) {
        state.currentCategory = category;
        state.currentPage = category;
        state.pageNumber = 1;
        state.currentQuery = category;

        this.updateHeaderContent(category);
        ApiService.loadImages(category);
    }

    static performSearch() {
        const query = elements.searchInput.value.trim();
        if (!query) return;

        state.currentQuery = query;
        state.currentCategory = '';
        state.pageNumber = 1;
        elements.headerTitle.textContent = `Search: ${query}`;
        elements.headerSubtitle.textContent = `Discover images related to "${query}"`;
        ApiService.loadImages(query);
        this.closeMobileMenu();
    }

    static updateHeaderContent(page) {
        const content = pageContent[page] || pageContent.explore;
        elements.headerTitle.textContent = content.title;
        elements.headerSubtitle.textContent = content.subtitle;
    }

    static toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        const icon = elements.mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    static closeMobileMenu() {
        if (window.innerWidth <= 968) {
            elements.navMenu.classList.remove('active');
            const icon = elements.mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            elements.collectionsDropdown.classList.remove('mobile-active');
        }
    }
}