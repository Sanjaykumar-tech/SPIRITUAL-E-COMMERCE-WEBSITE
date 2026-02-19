// ==================== GLOBAL VARIABLES ====================
let cart = [];
let currentBookFilter = 'all';
let currentVideoFilter = 'all';
let currentStoryFilter = 'all';
let videoSliderIndex = 0;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader after 2 seconds
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
        }, 500);
    }, 2000);

    // Load all content
    loadBooks();
    loadVideos();
    loadStories();
    loadVideoSlider();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart count
    updateCartCount();
    
    // Set random wisdom of the day
    getNewWisdom();
    
    // Start auto-update functions
    updateYouTubeStats();
    startVideoAutoScroll();
});

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.querySelector('.nav-menu').classList.remove('active');
        }
    });
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== VIDEO FUNCTIONS ====================
function loadVideos() {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredVideos = currentVideoFilter === 'all'
        ? videosData
        : videosData.filter(video => video.category === currentVideoFilter);
    
    filteredVideos.slice(0, 6).forEach(video => {
        const videoCard = `
            <div class="video-card" data-category="${video.category}" onclick="playVideo('${video.videoId}')">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-overlay">
                        <i class="fas fa-play-circle"></i>
                    </div>
                </div>
                <div class="video-info">
                    <div class="video-category">${getCategoryTamil(video.category)}</div>
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span><i class="fas fa-eye"></i> ${video.views}</span>
                        <span><i class="fas fa-clock"></i> ${video.date}</span>
                        <span><i class="fas fa-hourglass-half"></i> ${video.duration}</span>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += videoCard;
    });
}

function filterVideos(category) {
    currentVideoFilter = category;
    
    document.querySelectorAll('.video-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadVideos();
}

function playVideo(videoId) {
    window.open(`https://youtube.com/@AadhiyumAnthamum?si=-4mxytLGSWUp3Iyp`, '_blank');
}

function loadVideoSlider() {
    const slider = document.getElementById('videoSlider');
    if (!slider) return;
    
    slider.innerHTML = '';
    
    videosData.forEach(video => {
        const slide = `
            <div class="video-slide" onclick="playVideo('${video.videoId}')">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-slide-content">
                    <h4>${video.title}</h4>
                    <p>${video.views} பார்வைகள்</p>
                </div>
            </div>
        `;
        slider.innerHTML += slide;
    });
}

function slideVideos(direction) {
    const slider = document.querySelector('.video-slider');
    const slides = document.querySelectorAll('.video-slide');
    const slideWidth = slides[0]?.offsetWidth + 20 || 320;
    
    if (direction === 'next') {
        videoSliderIndex = Math.min(videoSliderIndex + 1, slides.length - 4);
    } else {
        videoSliderIndex = Math.max(videoSliderIndex - 1, 0);
    }
    
    slider.style.transform = `translateX(-${videoSliderIndex * slideWidth}px)`;
}

function startVideoAutoScroll() {
    setInterval(() => {
        const slides = document.querySelectorAll('.video-slide');
        if (slides.length > 0) {
            videoSliderIndex = (videoSliderIndex + 1) % (slides.length - 3);
            slideVideos('next');
        }
    }, 5000);
}

// ==================== ENHANCED BOOKS FUNCTIONS ====================

function loadBooks() {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredBooks = currentBookFilter === 'all' 
        ? booksData 
        : booksData.filter(book => book.category === currentBookFilter);
    
    filteredBooks.forEach(book => {
        const bookCard = createEnhancedBookCard(book);
        grid.innerHTML += bookCard;
    });
}

function createEnhancedBookCard(book) {
    return `
        <div class="book-card" data-category="${book.category}" style="--animation-order: ${book.id}">
            ${book.badge ? `<div class="book-badge">${book.badge}</div>` : ''}
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}">
                <div class="book-format-badge">
                    <i class="fas fa-file-pdf"></i> ${book.pages} பக்கங்கள் • ${book.fileSize}
                </div>
            </div>
            <div class="book-info">
                <div class="book-category">${getCategoryTamil(book.category)}</div>
                <h3 class="book-title">${book.title}</h3>
                <div class="book-author">${book.author}</div>
                
                <div class="book-price">
                    <span class="current-price">₹${book.price}</span>
                    <span class="old-price">₹${book.originalPrice}</span>
                </div>
                
                <div class="book-meta">
                    <span><i class="fas fa-file"></i> ${book.pages} பக்கங்கள்</span>
                    <span><i class="fas fa-database"></i> ${book.fileSize}</span>
                </div>
                
                <div class="book-rating">
                    ${getStarRating(book.rating)} <span>(${book.reviews})</span>
                </div>
                
                <p class="book-description">${book.description}</p>
                
                ${book.preview ? `
                    <button class="preview-btn" onclick="previewBook(${book.id})">
                        <i class="fas fa-eye"></i> Read Sample
                    </button>
                ` : ''}
                
                <button class="buy-now-btn" onclick="buyNow(${book.id})">
                    <i class="fas fa-bolt"></i> Buy Now & Download
                </button>
                
                <div class="instant-delivery-badge">
                    <i class="fas fa-bolt"></i> Instant Download After Payment
                </div>
            </div>
        </div>
    `;
}

// Buy Now (Single Purchase)
function buyNow(bookId) {
    const book = booksData.find(b => b.id === bookId);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showToast('Please login to purchase', 'warning');
        setTimeout(() => openLoginModal(), 1500);
        return;
    }
    
    // Direct checkout for single book
    processSingleBookCheckout(book, currentUser);
}

// Process single book checkout
function processSingleBookCheckout(book, user) {
    // Show payment options modal
    showPaymentModalForBook(book, user);
}

// Show payment modal for single book
function showPaymentModalForBook(book, user) {
    const modal = document.getElementById('paymentModal');
    const orderSummary = document.getElementById('orderSummary');
    const payAmount = document.getElementById('payAmount');
    
    orderSummary.innerHTML = `
        <h4>உங்கள் ஆர்டர்</h4>
        <div class="order-item">
            <span>${book.title}</span>
            <span>₹${book.price}</span>
        </div>
        <div class="order-item" style="font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
            <span>மொத்தம்</span>
            <span>₹${book.price}</span>
        </div>
    `;
    
    payAmount.textContent = book.price;
    
    // Store book info for payment processing
    sessionStorage.setItem('checkoutBook', JSON.stringify({
        id: book.id,
        title: book.title,
        price: book.price
    }));
    
    modal.classList.add('show');
}

// Override processPayment for e-books
function processPayment() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value;
    
    if (!name || !email || !phone || !address) {
        showToast('அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்', 'error');
        return;
    }
    
    // Get book from session
    const bookData = sessionStorage.getItem('checkoutBook');
    if (!bookData) {
        showToast('Checkout information missing', 'error');
        return;
    }
    
    const book = JSON.parse(bookData);
    
    // Generate download link
    const downloadLink = generateDownloadLink(book.id);
    
    // Save order
    const order = {
        id: 'order_' + Date.now(),
        bookId: book.id,
        bookTitle: book.title,
        amount: book.price,
        userName: name,
        userEmail: email,
        userPhone: phone,
        paymentMethod: 'UPI',
        status: 'success',
        date: new Date().toISOString(),
        downloadLink: downloadLink
    };
    
    saveOrder(order);
    
    // Close payment modal
    closeModal();
    
    // Clear checkout session
    sessionStorage.removeItem('checkoutBook');
    
    // Show success with download
    showDownloadSuccess(order);
    
    // Clear cart if any
    cart = [];
    saveCart();
    updateCartCount();
}

// Generate download link
function generateDownloadLink(bookId) {
    const token = btoa(bookId + Date.now() + Math.random()).substring(0, 20);
    return `https://yourdomain.com/download/${token}`;
}

// Save order
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Send email (simulated)
    sendOrderEmail(order);
}

// Send order email
function sendOrderEmail(order) {
    console.log('Email sent to:', order.userEmail);
    console.log('Download link:', order.downloadLink);
}

// Show download success
function showDownloadSuccess(order) {
    const successModal = document.createElement('div');
    successModal.className = 'modal show';
    successModal.innerHTML = `
        <div class="modal-content success-modal-content">
            <div class="modal-header success-header">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You for Your Purchase!</h3>
            </div>
            <div class="modal-body">
                <div class="success-animation">
                    <i class="fas fa-check-circle"></i>
                    <h4>${order.bookTitle}</h4>
                    <p>Your download is ready!</p>
                    
                    <div class="download-section">
                        <a href="${order.downloadLink}" class="download-btn pulse" download>
                            <i class="fas fa-download"></i> Download Now
                        </a>
                        <p class="email-note">
                            <i class="fas fa-envelope"></i> 
                            Download link also sent to ${order.userEmail}
                        </p>
                    </div>
                    
                    <div class="social-share">
                        <p>Share this book with friends:</p>
                        <div class="share-icons">
                            <a href="#" onclick="shareOnWhatsApp('${order.bookTitle}', '${order.downloadLink}')" class="share-icon whatsapp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="#" onclick="shareOnFacebook('${order.downloadLink}')" class="share-icon facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" onclick="shareOnTwitter('${order.bookTitle}', '${order.downloadLink}')" class="share-icon twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="spiritual-quote">
                        <i class="fas fa-quote-left"></i>
                        <p>"ஞானமே மிகப்பெரிய செல்வம்"</p>
                        <small>- திருவள்ளுவர்</small>
                    </div>
                    
                    <div class="channel-links">
                        <p>Follow us for more spiritual content:</p>
                        <a href="https://youtube.com/@AadhiyumAnthamum" target="_blank" class="channel-btn youtube">
                            <i class="fab fa-youtube"></i> YouTube
                        </a>
                        <a href="https://instagram.com/aathiyum.anthamum_" target="_blank" class="channel-btn instagram">
                            <i class="fab fa-instagram"></i> Instagram
                        </a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    setTimeout(() => {
        successModal.remove();
    }, 10000);
}

// Preview book sample
function previewBook(bookId) {
    const book = booksData.find(b => b.id === bookId);
    
    const previewModal = document.createElement('div');
    previewModal.className = 'modal show';
    previewModal.innerHTML = `
        <div class="modal-content preview-modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-eye"></i> Sample: ${book.title}</h3>
                <i class="fas fa-times" onclick="this.closest('.modal').remove()"></i>
            </div>
            <div class="modal-body">
                <div class="preview-content">
                    <div class="book-preview">
                        <h4>${book.title}</h4>
                        <p class="author">by ${book.author}</p>
                        
                        <div class="preview-pages">
                            ${generateSamplePages(book)}
                        </div>
                        
                        <div class="preview-footer">
                            <p>This is just a sample. Purchase the full book to read all ${book.pages} pages.</p>
                            <button class="btn btn-primary" onclick="buyNow(${book.id}); this.closest('.modal').remove()">
                                <i class="fas fa-bolt"></i> Buy Full Book (₹${book.price})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(previewModal);
}

// Generate sample pages content
function generateSamplePages(book) {
    let pages = '';
    for (let i = 1; i <= (book.samplePages || 3); i++) {
        pages += `
            <div class="sample-page">
                <p>... This is sample page ${i} of "${book.title}". The full book contains ${book.pages} pages of spiritual wisdom and guidance ...</p>
                <p>... Purchase the complete book to access all content including detailed explanations, stories, and practical exercises ...</p>
            </div>
        `;
    }
    return pages;
}

// Filter books
function filterBooks(category) {
    currentBookFilter = category;
    
    document.querySelectorAll('.book-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadBooks();
}

// Get category in Tamil
function getCategoryTamil(category) {
    const categories = {
        'thirukural': 'திருக்குறள்',
        'siddhar': 'சித்தர்கள்',
        'philosophy': 'தத்துவம்',
        'stories': 'சிறுகதைகள்'
    };
    return categories[category] || category;
}

// Get star rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Share functions
function shareOnWhatsApp(title, url) {
    const text = encodeURIComponent(`Check out this spiritual book: ${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function shareOnTwitter(title, url) {
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

// ==================== CART FUNCTIONS ====================
function addToCart(bookId) {
    const book = booksData.find(b => b.id === bookId);
    
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showToast('புத்தகம் வண்டியில் சேர்க்கப்பட்டது', 'success');
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    displayCartItems();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">உங்கள் வண்டி காலியாக உள்ளது</p>';
        cartTotal.textContent = '₹0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <i class="fas fa-trash cart-item-remove" onclick="removeFromCart(${item.id})"></i>
        `;
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `₹${total}`;
}

function updateQuantity(bookId, change) {
    const item = cart.find(i => i.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            saveCart();
            updateCartCount();
            displayCartItems();
        }
    }
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCartCount();
    displayCartItems();
    showToast('புத்தகம் நீக்கப்பட்டது');
}

// ==================== CHECKOUT FUNCTIONS ====================
function checkout() {
    if (cart.length === 0) {
        showToast('உங்கள் வண்டி காலியாக உள்ளது', 'error');
        return;
    }
    
    closeCart();
    openPaymentModal();
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const orderSummary = document.getElementById('orderSummary');
    const payAmount = document.getElementById('payAmount');
    
    let total = 0;
    let summaryHtml = '<h4>உங்கள் ஆர்டர்</h4>';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        summaryHtml += `
            <div class="order-item">
                <span>${item.title} x ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });
    
    summaryHtml += `
        <div class="order-item" style="font-weight: bold; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
            <span>மொத்தம்</span>
            <span>₹${total}</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHtml;
    payAmount.textContent = total;
    
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

// ==================== STORIES FUNCTIONS ====================
function loadStories() {
    const grid = document.getElementById('storiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredStories = currentStoryFilter === 'all'
        ? storiesData
        : storiesData.filter(story => story.category === currentStoryFilter);
    
    filteredStories.slice(0, 9).forEach(story => {
        const storyCard = `
            <div class="story-card" onclick="openStory('${story.id}')">
                <div class="story-image">
                    <img src="${story.image}" alt="${story.title}">
                </div>
                <div class="story-badge">${story.type || 'கதை'}</div>
                <div class="story-content">
                    <div class="story-date"><i class="far fa-calendar-alt"></i> ${formatDate(story.date)}</div>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-excerpt">${story.excerpt}</p>
                    <div class="story-footer">
                        <span><i class="fas fa-user"></i> ${story.author}</span>
                        <span><i class="fas fa-eye"></i> ${story.views || Math.floor(Math.random() * 5000)}</span>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += storyCard;
    });
}

function filterStories(category) {
    currentStoryFilter = category;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadStories();
}

function openStory(storyId) {
    const story = storiesData.find(s => s.id === storyId);
    if (story) {
        showToast(`"${story.title}" - முழு கதை விரைவில்...`, 'info');
    }
}

// ==================== LOGIN FUNCTIONS ====================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.getElementById('emailLogin').style.display = tab === 'email' ? 'block' : 'none';
    document.getElementById('mobileLogin').style.display = tab === 'mobile' ? 'block' : 'none';
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function sendOtp() {
    const mobile = document.getElementById('loginMobile').value.trim();
    if (mobile && mobile.length === 10) {
        showToast('OTP அனுப்பப்பட்டது', 'success');
    } else {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும்', 'error');
    }
}

function loginWithEmail() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        }));
        
        showToast('வெற்றிகரமாக உள்நுழைந்தீர்கள்!', 'success');
        closeLoginModal();
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showToast('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்', 'error');
    }
}

function loginWithMobile() {
    const mobile = document.getElementById('loginMobile').value.trim();
    const otp = document.getElementById('loginOtp').value.trim();
    
    if (!mobile || !otp) {
        showToast('மொபைல் எண் மற்றும் OTP ஐ உள்ளிடவும்', 'error');
        return;
    }
    
    if (!validatePhone(mobile)) {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும்', 'error');
        return;
    }
    
    if (otp.length !== 6) {
        showToast('சரியான OTP ஐ உள்ளிடவும்', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.phone === mobile);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            phone: user.phone
        }));
        
        showToast('வெற்றிகரமாக உள்நுழைந்தீர்கள்!', 'success');
        closeLoginModal();
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showToast('பதிவு செய்யப்படாத மொபைல் எண்', 'error');
    }
}

// ==================== FIX FOR REGISTER LINK ====================
function showRegister() {
    openRegisterModal();
    closeLoginModal();
}

// ==================== DAILY WISDOM ====================
const wisdomData = [
    { text: "இன்று நமக்குக் கிடைத்த நாள், நேற்று நாம் எதிர்பார்த்த நாளே அல்ல.", author: "திருவள்ளுவர்" },
    { text: "மனமே அனைத்திற்கும் மூலம். மனம் தூய்மையானால், உலகமே தூய்மை.", author: "புத்தர்" },
    { text: "உள்ளத்தில் உண்மை இருந்தால், வாக்கில் இனிமை இருக்கும்.", author: "திருவள்ளுவர்" },
    { text: "நாம் நினைப்பதே நாம் ஆகிறோம்.", author: "சித்தர்" },
    { text: "அமைதியே மிக உயர்ந்த இன்பம்.", author: "திருவள்ளுவர்" },
    { text: "கோபம் என்பது தன் கையில் சூடான கரியை எடுத்து மற்றவர் மீது வீச நினைப்பது போல.", author: "புத்தர்" },
    { text: "செய்யத் தகாத செயல்களைச் செய்யாதிருப்பதே அறிவு.", author: "திருவள்ளுவர்" },
    { text: "உன் மனமே உன் குரு. அதை நன்கு கேள்.", author: "சித்தர்" }
];

function getNewWisdom() {
    const randomIndex = Math.floor(Math.random() * wisdomData.length);
    const wisdom = wisdomData[randomIndex];
    
    document.getElementById('wisdomText').textContent = `"${wisdom.text}"`;
    document.getElementById('wisdomAuthor').textContent = `- ${wisdom.author}`;
}

// ==================== NEWSLETTER ====================
function subscribeNewsletter() {
    const email = document.querySelector('.newsletter-form input').value;
    if (email) {
        showToast('நன்றி! உங்கள் மின்னஞ்சல் பதிவு செய்யப்பட்டது.', 'success');
        document.querySelector('.newsletter-form input').value = '';
    } else {
        showToast('தயவுசெய்து உங்கள் மின்னஞ்சலை உள்ளிடவும்.', 'error');
    }
}

// ==================== REGISTER FUNCTIONS ====================

// Open Register Modal
function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('show');
        resetRegisterForms();
    }
}

// Close Register Modal
function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('show');
        resetRegisterForms();
    }
}

// Reset all register forms
function resetRegisterForms() {
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPhone = document.getElementById('regPhone');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const acceptTerms = document.getElementById('acceptTerms');
    
    if (regName) regName.value = '';
    if (regEmail) regEmail.value = '';
    if (regPhone) regPhone.value = '';
    if (regPassword) regPassword.value = '';
    if (regConfirmPassword) regConfirmPassword.value = '';
    if (acceptTerms) acceptTerms.checked = false;
    
    const regMobileName = document.getElementById('regMobileName');
    const regMobileNumber = document.getElementById('regMobileNumber');
    const regOtp = document.getElementById('regOtp');
    const acceptTermsMobile = document.getElementById('acceptTermsMobile');
    
    if (regMobileName) regMobileName.value = '';
    if (regMobileNumber) regMobileNumber.value = '';
    if (regOtp) regOtp.value = '';
    if (acceptTermsMobile) acceptTermsMobile.checked = false;
    
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    if (strengthFill) {
        strengthFill.className = 'strength-fill';
        strengthFill.style.width = '0';
    }
    if (strengthText) strengthText.textContent = '';
    
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) {
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerHTML = '<i class="fas fa-paper-plane"></i> OTP அனுப்பு';
    }
}

// Switch between Email and Mobile register tabs
function switchRegisterTab(tab) {
    document.querySelectorAll('.register-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.register-tab').classList.add('active');
    
    if (tab === 'email') {
        document.getElementById('emailRegister').style.display = 'block';
        document.getElementById('mobileRegister').style.display = 'none';
    } else {
        document.getElementById('emailRegister').style.display = 'none';
        document.getElementById('mobileRegister').style.display = 'block';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    if (!password) {
        strengthFill.className = 'strength-fill';
        strengthFill.style.width = '0';
        strengthText.textContent = '';
        return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    if (strength <= 2) {
        strengthFill.className = 'strength-fill weak';
        strengthFill.style.width = '33.33%';
        strengthText.textContent = 'பலவீனமான கடவுச்சொல்';
    } else if (strength <= 4) {
        strengthFill.className = 'strength-fill medium';
        strengthFill.style.width = '66.66%';
        strengthText.textContent = 'நடுத்தர கடவுச்சொல்';
    } else {
        strengthFill.className = 'strength-fill strong';
        strengthFill.style.width = '100%';
        strengthText.textContent = 'வலுவான கடவுச்சொல்';
    }
}

// Add password input listener
document.addEventListener('DOMContentLoaded', function() {
    const regPassword = document.getElementById('regPassword');
    if (regPassword) {
        regPassword.addEventListener('input', function(e) {
            checkPasswordStrength(e.target.value);
        });
    }
});

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone number
function validatePhone(phone) {
    const re = /^\d{10}$/;
    return re.test(phone);
}

// Register with Email
function registerWithEmail() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        showToast('அனைத்து புலங்களையும் பூர்த்தி செய்யவும்', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('கடவுச்சொற்கள் பொருந்தவில்லை', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showToast('நிபந்தனைகளை ஏற்கவும்', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast('சரியான தொலைபேசி எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
        showToast('இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', 'error');
        return;
    }
    
    if (users.some(u => u.phone === phone)) {
        showToast('இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', 'error');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        registeredAt: new Date().toISOString(),
        registeredVia: 'email'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccessAnimation('பதிவு வெற்றிகரமாக முடிந்தது!');
    
    setTimeout(() => {
        closeRegisterModal();
        
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        }));
        
        showToast('வரவேற்கிறோம் ' + name + '!', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, 2000);
}

// Send OTP for registration
function sendRegistrationOtp() {
    const mobile = document.getElementById('regMobileNumber').value.trim();
    const sendBtn = document.getElementById('sendOtpBtn');
    
    if (!mobile) {
        showToast('மொபைல் எண்ணை உள்ளிடவும்', 'error');
        return;
    }
    
    if (!validatePhone(mobile)) {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.phone === mobile)) {
        showToast('இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', 'error');
        return;
    }
    
    let countdown = 30;
    sendBtn.disabled = true;
    sendBtn.innerHTML = `<i class="fas fa-clock"></i> மீண்டும் அனுப்ப (${countdown})`;
    
    const timer = setInterval(() => {
        countdown--;
        if (sendBtn) {
            sendBtn.innerHTML = `<i class="fas fa-clock"></i> மீண்டும் அனுப்ப (${countdown}s)`;
        }
        
        if (countdown <= 0) {
            clearInterval(timer);
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> OTP அனுப்பு';
            }
        }
    }, 1000);
    
    const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
    showToast(`OTP அனுப்பப்பட்டது: ${demoOtp} (Demo)`, 'success');
    
    sessionStorage.setItem('registrationOtp', demoOtp);
    sessionStorage.setItem('registrationMobile', mobile);
}

// Register with Mobile/OTP
function registerWithMobile() {
    const name = document.getElementById('regMobileName').value.trim();
    const mobile = document.getElementById('regMobileNumber').value.trim();
    const otp = document.getElementById('regOtp').value.trim();
    const acceptTerms = document.getElementById('acceptTermsMobile').checked;
    
    if (!name || !mobile || !otp) {
        showToast('அனைத்து புலங்களையும் பூர்த்தி செய்யவும்', 'error');
        return;
    }
    
    if (!validatePhone(mobile)) {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)', 'error');
        return;
    }
    
    if (otp.length !== 6) {
        showToast('சரியான OTP ஐ உள்ளிடவும் (6 இலக்கங்கள்)', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showToast('நிபந்தனைகளை ஏற்கவும்', 'error');
        return;
    }
    
    const storedOtp = sessionStorage.getItem('registrationOtp');
    const storedMobile = sessionStorage.getItem('registrationMobile');
    
    if (otp !== '123456' && otp !== storedOtp) {
        showToast('தவறான OTP', 'error');
        return;
    }
    
    if (mobile !== storedMobile) {
        showToast('மொபைல் எண் பொருந்தவில்லை', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.phone === mobile)) {
        showToast('இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', 'error');
        return;
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        name: name,
        phone: mobile,
        registeredAt: new Date().toISOString(),
        registeredVia: 'mobile'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    sessionStorage.removeItem('registrationOtp');
    sessionStorage.removeItem('registrationMobile');
    
    showSuccessAnimation('பதிவு வெற்றிகரமாக முடிந்தது!');
    
    setTimeout(() => {
        closeRegisterModal();
        
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            phone: newUser.phone
        }));
        
        showToast('வரவேற்கிறோம் ' + name + '!', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, 2000);
}

// Show success animation
function showSuccessAnimation(message) {
    const modalBody = document.querySelector('.register-modal .modal-body');
    if (!modalBody) return;
    
    const originalContent = modalBody.innerHTML;
    
    modalBody.innerHTML = `
        <div class="success-animation">
            <i class="fas fa-check-circle"></i>
            <h4>வெற்றி!</h4>
            <p>${message}</p>
            <div class="loader"></div>
        </div>
    `;
    
    setTimeout(() => {
        modalBody.innerHTML = originalContent;
        const emailTab = document.querySelector('.register-tab');
        if (emailTab) {
            emailTab.classList.add('active');
            document.getElementById('emailRegister').style.display = 'block';
            document.getElementById('mobileRegister').style.display = 'none';
        }
    }, 2000);
}

function showTerms() {
    showToast('Terms & Conditions விரைவில் சேர்க்கப்படும்', 'info');
}

// Auto-format phone numbers
document.addEventListener('DOMContentLoaded', function() {
    const regPhone = document.getElementById('regPhone');
    const regMobileNumber = document.getElementById('regMobileNumber');
    const regOtp = document.getElementById('regOtp');
    
    if (regPhone) {
        regPhone.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }
    
    if (regMobileNumber) {
        regMobileNumber.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }
    
    if (regOtp) {
        regOtp.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }
});

// ==================== COMPLETE FIXED LOGIN FUNCTIONS ====================

// Login with Email
function loginWithEmail() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginBtn = event.target;
    
    if (!email || !password) {
        showToast('மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்', 'error');
        return;
    }
    
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> உள்நுழைகிறது...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }));
            
            showToast('வெற்றிகரமாக உள்நுழைந்தீர்கள்!', 'success');
            closeLoginModal();
            
            showWelcomeAnimation(user.name);
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showToast('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்', 'error');
            
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 1000);
}

// Login with Mobile/OTP
function loginWithMobile() {
    const mobile = document.getElementById('loginMobile').value.trim();
    const otp = document.getElementById('loginOtp').value.trim();
    const loginBtn = event.target;
    
    if (!mobile || !otp) {
        showToast('மொபைல் எண் மற்றும் OTP ஐ உள்ளிடவும்', 'error');
        return;
    }
    
    if (!validatePhone(mobile)) {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)', 'error');
        return;
    }
    
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        showToast('சரியான 6-இலக்க OTP ஐ உள்ளிடவும்', 'error');
        return;
    }
    
    const storedOtp = sessionStorage.getItem('loginOtp');
    const otpTimestamp = sessionStorage.getItem('loginOtpTimestamp');
    
    if (storedOtp && otpTimestamp) {
        const timeDiff = Date.now() - parseInt(otpTimestamp);
        if (timeDiff > 300000) {
            sessionStorage.removeItem('loginOtp');
            sessionStorage.removeItem('loginOtpTimestamp');
            showToast('OTP காலாவதியாகிவிட்டது. மீண்டும் அனுப்பவும்', 'error');
            return;
        }
    }
    
    if (otp !== '123456' && otp !== storedOtp) {
        showToast('தவறான OTP', 'error');
        return;
    }
    
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> உள்நுழைகிறது...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const user = users.find(u => u.phone === mobile);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email || ''
            }));
            
            sessionStorage.removeItem('loginOtp');
            sessionStorage.removeItem('loginOtpTimestamp');
            
            showToast('வெற்றிகரமாக உள்நுழைந்தீர்கள்!', 'success');
            closeLoginModal();
            
            showWelcomeAnimation(user.name);
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showToast('இந்த மொபைல் எண்ணில் கணக்கு இல்லை', 'error');
            
            if (confirm('புதிய கணக்கு உருவாக்க வேண்டுமா?')) {
                closeLoginModal();
                openRegisterModal();
            }
            
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }, 1000);
}

// Send OTP for login
function sendOtp() {
    const mobile = document.getElementById('loginMobile').value.trim();
    const otpBtn = event.target;
    
    if (!mobile) {
        showToast('மொபைல் எண்ணை உள்ளிடவும்', 'error');
        return;
    }
    
    if (!validatePhone(mobile)) {
        showToast('சரியான மொபைல் எண்ணை உள்ளிடவும் (10 இலக்கங்கள்)', 'error');
        return;
    }
    
    let countdown = 30;
    const originalText = otpBtn.innerHTML;
    otpBtn.disabled = true;
    
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    sessionStorage.setItem('loginOtp', generatedOtp);
    sessionStorage.setItem('loginOtpTimestamp', Date.now().toString());
    
    const timer = setInterval(() => {
        countdown--;
        otpBtn.innerHTML = `<i class="fas fa-clock"></i> மீண்டும் அனுப்ப (${countdown}s)`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            otpBtn.disabled = false;
            otpBtn.innerHTML = originalText;
        }
    }, 1000);
    
    showToast(`OTP: ${generatedOtp} (Demo)`, 'success');
    
    document.getElementById('loginOtp').value = generatedOtp;
}

// Validate phone number
function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

// Show welcome animation
function showWelcomeAnimation(userName) {
    const existing = document.querySelector('.welcome-animation');
    if (existing) existing.remove();
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-animation';
    welcomeDiv.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>வரவேற்கிறோம்!</h2>
            <p>${userName}</p>
            <div class="welcome-loader"></div>
        </div>
    `;
    
    document.body.appendChild(welcomeDiv);
    
    setTimeout(() => {
        welcomeDiv.style.opacity = '0';
        setTimeout(() => welcomeDiv.remove(), 500);
    }, 2000);
}

// Switch login tabs
function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (tab === 'email') {
        document.getElementById('emailLogin').style.display = 'block';
        document.getElementById('mobileLogin').style.display = 'none';
    } else {
        document.getElementById('emailLogin').style.display = 'none';
        document.getElementById('mobileLogin').style.display = 'block';
    }
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginMobile').value = '';
        document.getElementById('loginOtp').value = '';
        
        document.querySelectorAll('.login-tab')[0]?.classList.add('active');
        document.querySelectorAll('.login-tab')[1]?.classList.remove('active');
        document.getElementById('emailLogin').style.display = 'block';
        document.getElementById('mobileLogin').style.display = 'none';
        
        sessionStorage.removeItem('loginOtp');
        sessionStorage.removeItem('loginOtpTimestamp');
    }
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

// Check if user is logged in
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateUIForLoggedInUser(user);
        return true;
    }
    return false;
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]}`;
        loginBtn.href = '#';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            loadUserDashboard();
        };
    }
}

// Logout function
function logout() {
    if (confirm('வெளியேற வேண்டுமா?')) {
        localStorage.removeItem('currentUser');
        showToast('வெற்றிகரமாக வெளியேறினீர்கள்', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Add this CSS for welcome animation
const welcomeAnimationCSS = `
.welcome-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(139,69,19,0.95), rgba(212,175,55,0.95));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s;
}

.welcome-content {
    text-align: center;
    color: white;
    animation: scaleIn 0.5s;
}

.welcome-icon i {
    font-size: 80px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

.welcome-content h2 {
    font-size: 36px;
    margin-bottom: 10px;
}

.welcome-content p {
    font-size: 24px;
    opacity: 0.9;
    margin-bottom: 30px;
}

.welcome-loader {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto 0;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
`;

const style = document.createElement('style');
style.textContent = welcomeAnimationCSS;
document.head.appendChild(style);

// ==================== CONTACT FORM ====================
function sendMessage() {
    showToast('உங்கள் செய்தி அனுப்பப்பட்டது. விரைவில் தொடர்பு கொள்கிறோம்.', 'success');
    document.getElementById('contactForm').reset();
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ta-IN', options);
}