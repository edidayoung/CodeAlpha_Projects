// Configuration Constants
const UNSPLASH_ACCESS_KEY = 'ODfmoCjUgpIJd7qO0lwvpSTfmMNamtEFkRYOmaQdv5I';
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const CACHE_DURATION = 3600000; // 1 hour cache

// Storage Keys
const STORAGE_KEYS = {
    FAVORITES: 'frostframe_favorites',
    UPLOADED: 'frostframe_uploaded',
    IMAGE_CACHE: 'frostframe_cache',
    LAST_FETCH: 'frostframe_last_fetch'
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