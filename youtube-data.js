// ==================== YOUTUBE API CONFIGURATION ====================
const YOUTUBE_API_KEY = 'AIzaSyB-dhJOMnz7kxzZQS3A5viQBFcb2U9AFa0'; // உங்க API Key
const CHANNEL_ID = '@AadhiyumAnthamum'; // உங்க Channel

// ==================== LIVE YOUTUBE VIDEOS ====================
async function loadYouTubeVideos() {
    try {
        showLoading();
        
        // Get channel ID from handle
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!searchResponse.ok) {
            throw new Error('API Error: ' + searchResponse.status);
        }
        
        const searchData = await searchResponse.json();
        
        if (!searchData.items || searchData.items.length === 0) {
            throw new Error('Channel not found');
        }
        
        const channelId = searchData.items[0].snippet.channelId;
        
        // Get upload playlist
        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );
        
        const channelData = await channelResponse.json();
        const uploadPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Get videos
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${uploadPlaylistId}&key=${YOUTUBE_API_KEY}`
        );
        
        const videosData = await videosResponse.json();
        
        // Process and display videos
        const processedVideos = videosData.items.map(item => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('ta-IN'),
            videoId: item.snippet.resourceId.videoId
        }));
        
        displayVideos(processedVideos);
        updateStats(processedVideos.length);
        
    } catch (error) {
        console.error('Error loading videos:', error);
        showError('வீடியோக்களை ஏற்றுவதில் பிழை. API Key-ஐ சரிபார்க்கவும்.');
    }
}

// ==================== DISPLAY VIDEOS ====================
function displayVideos(videos) {
    const videosGrid = document.getElementById('videosGrid');
    const videoSlider = document.getElementById('videoSlider');
    
    if (!videos || videos.length === 0) {
        videosGrid.innerHTML = '<p class="no-videos">வீடியோக்கள் இல்லை</p>';
        return;
    }
    
    let gridHTML = '';
    let sliderHTML = '';
    
    videos.forEach((video, index) => {
        // Determine category based on title (simple logic)
        const category = getVideoCategory(video.title);
        
        // Grid view
        gridHTML += `
            <div class="video-card" data-category="${category}" onclick="playVideo('${video.videoId}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="video-play-btn">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title.substring(0, 60)}${video.title.length > 60 ? '...' : ''}</h3>
                    <p>${video.description ? video.description.substring(0, 80) + '...' : ''}</p>
                    <div class="video-meta">
                        <span><i class="far fa-calendar"></i> ${video.publishedAt}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Slider view (first 8 videos)
        if (index < 8) {
            sliderHTML += `
                <div class="video-slide" onclick="playVideo('${video.videoId}')">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="slide-overlay">
                        <i class="fas fa-play-circle"></i>
                        <h4>${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}</h4>
                    </div>
                </div>
            `;
        }
    });
    
    videosGrid.innerHTML = gridHTML;
    videoSlider.innerHTML = sliderHTML;
}

// ==================== HELPER FUNCTIONS ====================
function getVideoCategory(title) {
    title = title.toLowerCase();
    if (title.includes('திருக்குறள்') || title.includes('thirukural') || title.includes('குறள்')) {
        return 'thirukural';
    } else if (title.includes('சித்தர்') || title.includes('siddhar') || title.includes('யோகி')) {
        return 'siddhar';
    } else if (title.includes('கதை') || title.includes('story') || title.includes('வரலாறு')) {
        return 'stories';
    }
    return 'all';
}

function playVideo(videoId) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==================== FILTER VIDEOS ====================
function filterVideos(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter videos
    const videos = document.querySelectorAll('.video-card');
    videos.forEach(video => {
        if (category === 'all' || video.dataset.category === category) {
            video.style.display = 'block';
        } else {
            video.style.display = 'none';
        }
    });
}

// ==================== SLIDER FUNCTION ====================
let currentSlide = 0;

function slideVideos(direction) {
    const slider = document.getElementById('videoSlider');
    const slides = document.querySelectorAll('.video-slide');
    
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].offsetWidth + 20;
    
    if (direction === 'next') {
        currentSlide = Math.min(currentSlide + 1, slides.length - 3);
    } else {
        currentSlide = Math.max(currentSlide - 1, 0);
    }
    
    slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

// ==================== UPDATE STATS ====================
function updateStats(videoCount) {
    const totalVideos = document.getElementById('totalVideos');
    if (totalVideos) {
        totalVideos.textContent = videoCount;
    }
}

// ==================== LOADING & ERROR ====================
function showLoading() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>வீடியோக்கள் ஏற்றப்படுகின்றன...</p>
        </div>
    `;
}

function showError(message) {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="loadYouTubeVideos()" class="retry-btn">
                <i class="fas fa-redo"></i> மீண்டும் முயற்சிக்கவும்
            </button>
        </div>
    `;
}

// ==================== AUTO UPDATE STATS (Optional) ====================
function updateYouTubeStats() {
    // This can be removed or modified to show real stats
    setInterval(() => {
        // You can add channel statistics here if needed
        console.log('Auto-update running...');
    }, 30000);
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeVideos();
    updateYouTubeStats(); // Optional
});

// Remove the old auto-update function or modify it