// Default playlist with sample songs
const defaultPlaylist = [
    {
        title: "Summer Vibes",
        artist: "DJ Sunset",
        duration: "3:45",
        icon: "☀️",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        color: "#FF6B6B"
    },
    {
        title: "Midnight Dreams",
        artist: "Luna Eclipse",
        duration: "4:20",
        icon: "🌙",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        color: "#4ECDC4"
    },
    {
        title: "Electric Rain",
        artist: "Storm Chasers",
        duration: "3:55",
        icon: "⚡",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        color: "#45B7D1"
    },
    {
        title: "Ocean Waves",
        artist: "Aqua Soul",
        duration: "5:10",
        icon: "🌊",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        color: "#96CEB4"
    },
    {
        title: "Urban Rhythm",
        artist: "City Beats",
        duration: "3:30",
        icon: "🏙️",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        color: "#FECA57"
    }
];

// DOM elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const backward10Btn = document.getElementById('backward10Btn');
const forward30Btn = document.getElementById('forward30Btn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const albumArtCircle = document.getElementById('albumArtCircle');
const playlistEl = document.getElementById('playlist');
const savedPlaylistsEl = document.getElementById('savedPlaylists');
const fileInput = document.getElementById('fileInput');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const playlistModal = document.getElementById('playlistModal');
const cancelPlaylist = document.getElementById('cancelPlaylist');
const createPlaylist = document.getElementById('createPlaylist');
const playlistName = document.getElementById('playlistName');
const songsCheckboxes = document.getElementById('songsCheckboxes');
const backgroundOverlay = document.getElementById('backgroundOverlay');
const playlistTabs = document.querySelectorAll('.playlist-tab');

let currentPlaylist = [...defaultPlaylist];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let userPlaylists = [];

// Initialize the player
function initPlayer() {
    initPlaylist();
    loadSong(0);
    audio.volume = volumeSlider.value / 100;
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    backward10Btn.addEventListener('click', () => seek(-10));
    forward30Btn.addEventListener('click', () => seek(30));
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    progressBar.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', updateVolume);
    volumeIcon.addEventListener('click', toggleMute);
    fileInput.addEventListener('change', handleFileUpload);
    createPlaylistBtn.addEventListener('click', showPlaylistModal);
    cancelPlaylist.addEventListener('click', hidePlaylistModal);
    createPlaylist.addEventListener('click', createNewPlaylist);

    // Playlist tab switching
    playlistTabs.forEach(tab => {
        tab.addEventListener('click', () => switchPlaylistTab(tab.dataset.playlist));
    });

    // Audio event listeners
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadedmetadata', updateDuration);
}

// Switch between playlist tabs
function switchPlaylistTab(tab) {
    playlistTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-playlist="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.playlist-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tab === 'current') {
        playlistEl.classList.add('active');
    } else {
        savedPlaylistsEl.classList.add('active');
        loadSavedPlaylists();
    }
}

