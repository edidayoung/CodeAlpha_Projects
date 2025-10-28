// Application State Management
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