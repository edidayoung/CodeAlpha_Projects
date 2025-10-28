// API Service for Unsplash Interactions
class ApiService {
    static async loadImages(query = '', page = 1) {
        if (state.isLoading) return;

        state.isLoading = true;
        UIHelpers.showLoading();

        try {
            const cacheKey = `${query || 'random'}_${page}`;
            const now = Date.now();
            const lastFetch = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_FETCH) || '0');

            // Check cache for random images on first page
            if (!query && page === 1 && (now - lastFetch) < CACHE_DURATION) {
                const cached = state.cachedImages[cacheKey];
                if (cached) {
                    ImageManager.displayImages(cached);
                    UIHelpers.hideLoading();
                    state.isLoading = false;
                    return;
                }
            }

            let url;
            if (query) {
                url = `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=12&orientation=landscape`;
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
            const images = query ? data.results : data;

            // Cache random images on first page
            if (!query && page === 1) {
                state.cachedImages[cacheKey] = images;
                localStorage.setItem(STORAGE_KEYS.LAST_FETCH, now.toString());
            }

            ImageManager.displayImages(images);

            // Show load more button for search results with more pages
            if (query && data.total_pages > page) {
                elements.loadMoreBtn.style.display = 'block';
            } else {
                elements.loadMoreBtn.style.display = 'none';
            }

        } catch (error) {
            console.error('Error loading images:', error);
            UIHelpers.showError('Failed to load images. Please try again later.');
        } finally {
            UIHelpers.hideLoading();
            state.isLoading = false;
        }
    }

    static async loadIceLensImages() {
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
        return data.results;
    }
}