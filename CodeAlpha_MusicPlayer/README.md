// Initialize playlist display
function initPlaylist() {
    playlistEl.innerHTML = '';
    currentPlaylist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div class="playlist-item-number">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        item.addEventListener('click', () => loadSong(index));
        playlistEl.appendChild(item);
    });
}

// Load saved playlists
function loadSavedPlaylists() {
    savedPlaylistsEl.innerHTML = '';
    
    if (userPlaylists.length === 0) {
        savedPlaylistsEl.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No saved playlists yet</p>';
        return;
    }
    
    userPlaylists.forEach((playlist, index) => {
        const item = document.createElement('div');
        item.className = 'saved-playlist-item';
        item.innerHTML = `
            <h4>${playlist.name}</h4>
            <p>${playlist.songs.length} songs</p>
            <div class="playlist-actions">
                <button class="file-input-label" onclick="loadPlaylistToPlayer(${index})">
                    <i class="fas fa-play"></i> Load
                </button>
                <button class="file-input-label" onclick="addPlaylistToCurrent(${index})" style="background: var(--accent);">
                    <i class="fas fa-plus"></i> Add to Current
                </button>
            </div>
        `;
        savedPlaylistsEl.appendChild(item);
    });
}

// Load a playlist to the player
function loadPlaylistToPlayer(playlistIndex) {
    currentPlaylist = [...userPlaylists[playlistIndex].songs];
    currentSongIndex = 0;
    initPlaylist();
    loadSong(0);
    switchPlaylistTab('current');
}

// Add playlist to current playlist
function addPlaylistToCurrent(playlistIndex) {
    const playlistToAdd = userPlaylists[playlistIndex].songs;
    currentPlaylist = [...currentPlaylist, ...playlistToAdd];
    initPlaylist();
    switchPlaylistTab('current');
}

// Load a song
function loadSong(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    audio.src = song.url;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumArtCircle.textContent = song.icon;
    
    // Update background based on song color
    if (song.color) {
        backgroundOverlay.style.background = `linear-gradient(135deg, ${song.color}40 0%, transparent 100%)`;
    } else {
        backgroundOverlay.style.background = `linear-gradient(135deg, var(--primary-glow) 0%, transparent 100%)`;
    }
    
    // Update active playlist item
    updatePlaylistDisplay();
    
    if (isPlaying) {
        audio.play();
    }
}

// Update playlist display
function updatePlaylistDisplay() {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Play/Pause toggle
function togglePlay() {
    if (!audio.src) {
        loadSong(0);
    }
    
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Seek forward or backward
function seek(seconds) {
    audio.currentTime += seconds;
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.style.background = isShuffled ? 'var(--primary)' : 'var(--card-bg)';
    shuffleBtn.style.color = isShuffled ? 'var(--bg-dark)' : 'var(--text-ice)';
    
    if (isShuffled) {
        // Store original indices and shuffle
        currentPlaylist.forEach((song, index) => {
            song.originalIndex = index;
        });
        
        for (let i = currentPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentPlaylist[i], currentPlaylist[j]] = [currentPlaylist[j], currentPlaylist[i]];
        }
    } else {
        // Restore original order
        currentPlaylist.sort((a, b) => a.originalIndex - b.originalIndex);
    }
    
    initPlaylist();
    updatePlaylistDisplay();
}

// Toggle repeat
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    
    switch (repeatMode) {
        case 0:
            repeatBtn.style.background = 'var(--card-bg)';
            repeatBtn.style.color = 'var(--text-ice)';
            repeatBtn.title = 'No Repeat';
            break;
        case 1:
            repeatBtn.style.background = 'var(--primary)';
            repeatBtn.style.color = 'var(--bg-dark)';
            repeatBtn.title = 'Repeat All';
            break;
        case 2:
            repeatBtn.style.background = 'var(--accent)';
            repeatBtn.style.color = 'var(--bg-dark)';
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
            repeatBtn.title = 'Repeat One';
            break;
    }
}

// Handle song end
function handleSongEnd() {
    switch (repeatMode) {
        case 0: // No repeat
            nextSong();
            break;
        case 1: // Repeat all
            nextSong();
            break;
        case 2: // Repeat one
            audio.currentTime = 0;
            audio.play();
            break;
    }
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar and time display
function updateProgress() {
    const { duration, currentTime } = audio;
    
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

// Update duration display
function updateDuration() {
    durationEl.textContent = formatTime(audio.duration);
}

// Set progress by clicking on progress bar
function setProgress(e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    audio.currentTime = (clickX / width) * duration;
}

// Update volume based on slider
function updateVolume() {
    audio.volume = volumeSlider.value / 100;
    
    // Update volume icon
    if (audio.volume === 0) {
        volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (audio.volume < 0.5) {
        volumeIcon.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Toggle mute
function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        audio.volume = 0.7;
        volumeSlider.value = 70;
        volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Handle file upload
function handleFileUpload(e) {
    const files = e.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const newSong = {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                artist: "Unknown Artist",
                duration: "0:00",
                icon: "🎵",
                url: url,
                color: getRandomColor()
            };
            
            currentPlaylist.push(newSong);
        }
    }
    
    initPlaylist();
    fileInput.value = ''; // Reset file input
}

// Show playlist creation modal
function showPlaylistModal() {
    playlistModal.style.display = 'flex';
    playlistName.value = '';
    
    // Populate songs checkboxes
    songsCheckboxes.innerHTML = '';
    const allSongs = [...defaultPlaylist, ...currentPlaylist.filter(song => !defaultPlaylist.includes(song))];
    
    allSongs.forEach((song, index) => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'song-checkbox';
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="song-${index}" value="${index}" checked>
            <label for="song-${index}" class="song-checkbox-label">${song.title} - ${song.artist}</label>
        `;
        songsCheckboxes.appendChild(checkboxDiv);
    });
}

// Hide playlist creation modal
function hidePlaylistModal() {
    playlistModal.style.display = 'none';
}

// Create a new playlist
function createNewPlaylist() {
    const name = playlistName.value.trim();
    if (!name) {
        alert("Please enter a playlist name");
        return;
    }
    
    // Get selected songs
    const selectedSongs = [];
    const checkboxes = songsCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        alert("Please select at least one song for the playlist");
        return;
    }
    
    checkboxes.forEach(checkbox => {
        const songIndex = parseInt(checkbox.value);
        const allSongs = [...defaultPlaylist, ...currentPlaylist.filter(song => !defaultPlaylist.includes(song))];
        if (allSongs[songIndex]) {
            selectedSongs.push(allSongs[songIndex]);
        }
    });
    
    userPlaylists.push({
        name: name,
        songs: selectedSongs
    });
    
    alert(`Playlist "${name}" created successfully with ${selectedSongs.length} songs!`);
    hidePlaylistModal();
    loadSavedPlaylists();
}

// Get a random color for background
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Handle play event
function onPlay() {
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    document.querySelector('.album-art').classList.add('playing');
}

// Handle pause event
function onPause() {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    document.querySelector('.album-art').classList.remove('playing');
}

// Make functions available globally for onclick handlers
window.loadPlaylistToPlayer = loadPlaylistToPlayer;
window.addPlaylistToCurrent = addPlaylistToCurrent;

// Initialize the player when the page loads
window.addEventListener('DOMContentLoaded', initPlayer);