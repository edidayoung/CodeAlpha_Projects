// Local Storage Operations
class StorageManager {
    static saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
            localStorage.setItem(STORAGE_KEYS.UPLOADED, JSON.stringify(state.uploadedImages));
        } catch (error) {
            console.error('Error saving to storage:', error);
            UIHelpers.showNotification('Failed to save. Storage might be full.', 'error');
        }
    }

    static loadFromStorage() {
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
}