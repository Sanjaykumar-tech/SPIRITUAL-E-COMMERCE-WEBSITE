// ==================== ENHANCEMENTS & NEW FEATURES ====================

// ==================== 1. USER DASHBOARD ====================
function loadUserDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast('தயவுசெய்து முதலில் உள்நுழையவும்', 'warning');
        return;
    }
    
    // Check if dashboard exists, if not create it
    if (!document.getElementById('userDashboard')) {
        createUserDashboard();
    }
    
    // Show dashboard
    document.getElementById('userDashboard').classList.add('active');
    
    // Load user data
    document.getElementById('dashboardUserName').textContent = currentUser.name;
    document.getElementById('dashboardUserEmail').textContent = currentUser.email;
    document.getElementById('dashboardUserPhone').textContent = currentUser.phone || 'Not provided';
    
    // Load orders
    loadUserOrders();
    
    // Load wishlist
    loadUserWishlist();
}

function createUserDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'User' };
    const dashboard = document.createElement('div');
    dashboard.id = 'userDashboard';
    dashboard.className = 'screen';
    dashboard.innerHTML = `
        <div class="dashboard-header">
            <div class="header-left">
                <i class="fas fa-arrow-left" onclick="goBack()"></i>
                <h2>என் கணக்கு</h2>
            </div>
        </div>
        
        <div class="dashboard-content">
            <div class="user-profile-card">
                <div class="profile-header">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8B4513&color=fff&size=100" alt="Profile">
                    <h3 id="dashboardUserName"></h3>
                    <p id="dashboardUserEmail"></p>
                    <p id="dashboardUserPhone"></p>
                </div>
                <div class="profile-actions">
                    <button class="btn btn-secondary" onclick="editProfile()">
                        <i class="fas fa-edit"></i> சுயவிவரம் தொகுக்க
                    </button>
                    <button class="btn btn-secondary" onclick="changePassword()">
                        <i class="fas fa-key"></i> கடவுச்சொல் மாற்ற
                    </button>
                </div>
            </div>
            
            <div class="dashboard-tabs">
                <button class="dashboard-tab active" onclick="switchDashboardTab('orders')">என் ஆர்டர்கள்</button>
                <button class="dashboard-tab" onclick="switchDashboardTab('wishlist')">விருப்பப்பட்டியல்</button>
                <button class="dashboard-tab" onclick="switchDashboardTab('settings')">அமைப்புகள்</button>
            </div>
            
            <div id="dashboardOrders" class="dashboard-tab-content active">
                <h3>என் ஆர்டர்கள்</h3>
                <div id="ordersList" class="orders-list">
                    <!-- Orders will be loaded here -->
                </div>
            </div>
            
            <div id="dashboardWishlist" class="dashboard-tab-content">
                <h3>விருப்பப்பட்டியல்</h3>
                <div id="wishlistGrid" class="books-grid">
                    <!-- Wishlist items will be loaded here -->
                </div>
            </div>
            
            <div id="dashboardSettings" class="dashboard-tab-content">
                <h3>கணக்கு அமைப்புகள்</h3>
                <div class="settings-list">
                    <div class="setting-item">
                        <span>மின்னஞ்சல் அறிவிப்புகள்</span>
                        <label class="switch">
                            <input type="checkbox" id="emailNotifications" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span>SMS அறிவிப்புகள்</span>
                        <label class="switch">
                            <input type="checkbox" id="smsNotifications">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span>இருண்ட தீம்</span>
                        <label class="switch">
                            <input type="checkbox" id="darkTheme" onchange="toggleTheme()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span>மொழி</span>
                        <select id="languageSelect" onchange="changeLanguage()">
                            <option value="ta">தமிழ்</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-danger" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> வெளியேறு
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dashboard);
}

function loadUserOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.userEmail === currentUser?.email);
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-state">எந்த ஆர்டரும் இல்லை</p>';
        return;
    }
    
    ordersList.innerHTML = '';
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">ஆர்டர் #${order.id.slice(0, 8)}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString('ta-IN')}</span>
                <span class="order-status status-${order.status}">${getOrderStatusTamil(order.status)}</span>
            </div>
            <div class="order-items">
                <div class="order-item">
                    <img src="${order.bookImage || 'images/default-book.jpg'}" alt="${order.bookTitle}">
                    <div class="item-details">
                        <h4>${order.bookTitle}</h4>
                        <p>₹${order.amount}</p>
                    </div>
                </div>
            </div>
            <div class="order-footer">
                <span class="order-total">₹${order.amount}</span>
                <button class="btn-track" onclick="window.open('${order.downloadLink}', '_blank')">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

function getOrderStatusTamil(status) {
    const statusMap = {
        'success': 'வெற்றி',
        'pending': 'நிலுவையில்',
        'failed': 'தோல்வி'
    };
    return statusMap[status] || status;
}

// ==================== 2. WISHLIST FEATURE ====================
let wishlist = [];

function loadWishlist() {
    wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    updateWishlistCount();
}

function toggleWishlist(bookId) {
    const index = wishlist.indexOf(bookId);
    if (index === -1) {
        wishlist.push(bookId);
        showToast('விருப்பப்பட்டியலில் சேர்க்கப்பட்டது', 'success');
    } else {
        wishlist.splice(index, 1);
        showToast('விருப்பப்பட்டியலில் இருந்து நீக்கப்பட்டது', 'info');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistButton(bookId);
}

function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistBtn = document.getElementById('wishlistCount');
    if (wishlistBtn) {
        wishlistBtn.textContent = count;
    }
}

function updateWishlistButton(bookId) {
    const btn = document.querySelector(`.wishlist-btn[data-id="${bookId}"]`);
    if (btn) {
        if (wishlist.includes(bookId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

function loadUserWishlist() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) return;
    
    const wishlistBooks = booksData.filter(book => wishlist.includes(book.id));
    
    if (wishlistBooks.length === 0) {
        grid.innerHTML = '<p class="empty-state">விருப்பப்பட்டியல் காலியாக உள்ளது</p>';
        return;
    }
    
    grid.innerHTML = '';
    wishlistBooks.forEach(book => {
        const bookCard = `
            <div class="book-card">
                <div class="book-image">
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <div class="book-price">₹${book.price}</div>
                    <button class="add-to-cart" onclick="addToCart(${book.id})">
                        வண்டியில் சேர்
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += bookCard;
    });
}

// ==================== 3. REVIEWS & RATINGS ====================
function addReview(bookId, rating, comment) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showToast('மதிப்பீடு சேர்க்க உள்நுழையவும்', 'warning');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        bookId: bookId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        verified: true
    };
    
    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    showToast('மதிப்பீடு சேர்க்கப்பட்டது', 'success');
    displayBookReviews(bookId);
}

function displayBookReviews(bookId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const bookReviews = reviews.filter(r => r.bookId === bookId);
    
    const reviewsContainer = document.getElementById(`reviews-${bookId}`);
    if (!reviewsContainer) return;
    
    if (bookReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>இதுவரை மதிப்பீடுகள் இல்லை</p>';
        return;
    }
    
    reviewsContainer.innerHTML = bookReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${review.userName}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString('ta-IN')}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
            ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> சரிபார்க்கப்பட்ட வாங்குதல்</span>' : ''}
        </div>
    `).join('');
}

// ==================== 4. THEME TOGGLE ====================
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update theme color
    if (isDark) {
        document.documentElement.style.setProperty('--light', '#1a1a1a');
        document.documentElement.style.setProperty('--dark', '#f5f5f5');
        document.documentElement.style.setProperty('--text', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--light', '#FDF5E6');
        document.documentElement.style.setProperty('--dark', '#2C1810');
        document.documentElement.style.setProperty('--text', '#4A2C1A');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('darkTheme')?.checked = true;
    }
}

// ==================== 5. LANGUAGE SWITCHER ====================
const translations = {
    ta: {
        home: 'முகப்பு',
        videos: 'வீடியோக்கள்',
        books: 'புத்தகங்கள்',
        stories: 'கதைகள்',
        about: 'எங்களைப் பற்றி',
        contact: 'தொடர்புக்கு',
        login: 'உள்நுழைய',
        register: 'பதிவு செய்க',
        cart: 'வண்டி'
    },
    en: {
        home: 'Home',
        videos: 'Videos',
        books: 'Books',
        stories: 'Stories',
        about: 'About Us',
        contact: 'Contact',
        login: 'Login',
        register: 'Register',
        cart: 'Cart'
    }
};

function changeLanguage() {
    const lang = document.getElementById('languageSelect')?.value || 'ta';
    localStorage.setItem('language', lang);
    updateUILanguage(lang);
}

function updateUILanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function loadLanguage() {
    const savedLang = localStorage.getItem('language') || 'ta';
    document.getElementById('languageSelect')?.value = savedLang;
    updateUILanguage(savedLang);
}

// ==================== 6. PUSH NOTIFICATIONS ====================
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('அறிவிப்புகள் இயக்கப்பட்டன', 'success');
            }
        });
    }
}

function sendNotification(title, body, icon = '/images/logo.png') {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon
        });
    }
}

// ==================== 7. ORDER TRACKING ====================
function trackOrder(orderId) {
    const order = JSON.parse(localStorage.getItem('orders') || '[]').find(o => o.id === orderId);
    if (!order) {
        showToast('ஆர்டர் கிடைக்கவில்லை', 'error');
        return;
    }
    
    // Create tracking modal
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>ஆர்டர் கண்காணிப்பு #${orderId.slice(0, 8)}</h3>
                <i class="fas fa-times" onclick="this.closest('.modal').remove()"></i>
            </div>
            <div class="modal-body">
                <div class="tracking-timeline">
                    <div class="tracking-step completed">
                        <div class="step-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="step-info">
                            <h4>ஆர்டர் செய்யப்பட்டது</h4>
                            <p>${new Date(order.date).toLocaleString('ta-IN')}</p>
                        </div>
                    </div>
                    <div class="tracking-step completed">
                        <div class="step-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="step-info">
                            <h4>பணம் செலுத்தப்பட்டது</h4>
                            <p>${order.paymentMethod}</p>
                        </div>
                    </div>
                    <div class="tracking-step completed">
                        <div class="step-icon">
                            <i class="fas fa-download"></i>
                        </div>
                        <div class="step-info">
                            <h4>Download Ready</h4>
                            <a href="${order.downloadLink}" target="_blank">Click to Download</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==================== 8. SOCIAL SHARING ====================
function shareOnWhatsApp(title, url) {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareOnTwitter(title, url) {
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

// ==================== 9. SEARCH FUNCTIONALITY ====================
function performSearch(query) {
    if (!query || query.length < 2) return [];
    
    const results = [];
    
    // Search books
    if (typeof booksData !== 'undefined') {
        const bookResults = booksData.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.description.toLowerCase().includes(query.toLowerCase())
        ).map(book => ({ ...book, type: 'book' }));
        results.push(...bookResults);
    }
    
    // Search stories
    if (typeof storiesData !== 'undefined') {
        const storyResults = storiesData.filter(story => 
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.author.toLowerCase().includes(query.toLowerCase()) ||
            story.excerpt.toLowerCase().includes(query.toLowerCase())
        ).map(story => ({ ...story, type: 'story' }));
        results.push(...storyResults);
    }
    
    // Search videos
    if (typeof videosData !== 'undefined') {
        const videoResults = videosData.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase())
        ).map(video => ({ ...video, type: 'video' }));
        results.push(...videoResults);
    }
    
    displaySearchResults(results);
    return results;
}

function displaySearchResults(results) {
    let modal = document.getElementById('searchResultsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'searchResultsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>தேடல் முடிவுகள்</h3>
                    <i class="fas fa-times" onclick="this.closest('.modal').classList.remove('show')"></i>
                </div>
                <div class="modal-body">
                    <div id="searchResultsList"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const resultsList = document.getElementById('searchResultsList');
    
    if (results.length === 0) {
        resultsList.innerHTML = '<p class="no-results">எந்த முடிவும் இல்லை</p>';
    } else {
        resultsList.innerHTML = results.map(item => `
            <div class="search-result-item" onclick="openResult('${item.type}', '${item.id}')">
                <img src="${item.image || item.thumbnail}" alt="${item.title}">
                <div class="result-info">
                    <h4>${item.title}</h4>
                    <p>${item.type === 'book' ? item.author : item.type === 'story' ? item.author : item.views + ' பார்வைகள்'}</p>
                </div>
            </div>
        `).join('');
    }
    
    modal.classList.add('show');
}

function openResult(type, id) {
    if (type === 'book') {
        window.location.href = `#books-${id}`;
    } else if (type === 'story') {
        window.location.href = `#stories-${id}`;
    } else {
        window.open('https://youtube.com/@AadhiyumAnthamum', '_blank');
    }
    document.getElementById('searchResultsModal')?.classList.remove('show');
}

// ==================== 10. INITIALIZE ALL FEATURES ====================
document.addEventListener('DOMContentLoaded', function() {
    // Load wishlist
    loadWishlist();
    
    // Load theme
    loadTheme();
    
    // Load language
    loadLanguage();
    
    // Add search bar
    addSearchBar();
});

function addSearchBar() {
    const searchHTML = `
        <div class="global-search">
            <i class="fas fa-search"></i>
            <input type="text" id="globalSearchInput" placeholder="தேடுக... புத்தகங்கள், கதைகள், வீடியோக்கள்" onkeyup="if(event.key === 'Enter') performSearch(this.value)">
            <button onclick="performSearch(document.getElementById('globalSearchInput').value)">
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Add to navigation
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        const searchDiv = document.createElement('div');
        searchDiv.innerHTML = searchHTML;
        navContainer.appendChild(searchDiv.firstChild);
    }
}

function editProfile() {
    showToast('Edit profile feature coming soon', 'info');
}

function changePassword() {
    showToast('Change password feature coming soon', 'info');
}

function switchDashboardTab(tab) {
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dashboard-tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`dashboard${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

function goBack() {
    window.location.href = '#home';
}

// ==================== FIXED: Add this function for register link ====================
function showRegister() {
    openRegisterModal();
    closeLoginModal();
}