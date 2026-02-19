// ==================== RAZORPAY PAYMENT GATEWAY CONFIGURATION ====================

// Razorpay Configuration
const RAZORPAY_CONFIG = {
    key: "rzp_test_YOUR_KEY_HERE", // Replace with your actual Razorpay key
    name: "ஆதியும் அந்தமும்",
    description: "ஆன்மீக புத்தகங்கள்",
    image: "/images/logo.png",
    currency: "INR",
    theme: {
        color: "#8B4513"
    },
    prefill: {
        name: "",
        email: "",
        contact: ""
    },
    notes: {
        address: "Ulundurpet, TN 606107"
    }
};

// UPI QR Code Generator (Static)
const UPI_CONFIG = {
    upiId: "yesk71955ypl@okhdfcbank", // Your UPI ID
    name: "ஆதியும் அந்தமும்",
    note: "Book Purchase"
};

// Process payment with Razorpay
function processRazorpayPayment(amount, bookDetails, userDetails) {
    return new Promise((resolve, reject) => {
        const options = {
            ...RAZORPAY_CONFIG,
            amount: amount * 100, // Convert to paise
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone
            },
            handler: function(response) {
                // Payment successful
                handlePaymentSuccess(response, bookDetails, userDetails);
                resolve(response);
            },
            modal: {
                ondismiss: function() {
                    showToast('Payment cancelled', 'warning');
                    reject('Payment cancelled');
                }
            }
        };
        
        const razorpay = new Razorpay(options);
        razorpay.open();
    });
}

// Handle UPI payment via QR/Intent
function processUPIPayment(amount, bookDetails, userDetails) {
    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(bookDetails.title)}`;
    
    // Open UPI app
    window.location.href = upiLink;
    
    // Show QR code for manual payment
    showUPIQRCode(amount, bookDetails);
    
    // Wait for payment confirmation
    return new Promise((resolve) => {
        // This would typically be handled by webhook
        setTimeout(() => {
            resolve({ success: true });
        }, 30000);
    });
}

// Show UPI QR Code
function showUPIQRCode(amount, bookDetails) {
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-modal';
    qrContainer.innerHTML = `
        <div class="qr-content">
            <h3>Scan & Pay</h3>
            <div id="qrcode"></div>
            <p>Amount: ₹${amount}</p>
            <p>UPI ID: ${UPI_CONFIG.upiId}</p>
            <p>After payment, click "I've Paid"</p>
            <button onclick="confirmManualPayment('${bookDetails.id}')">I've Paid</button>
            <button onclick="this.closest('.qr-modal').remove()">Cancel</button>
        </div>
    `;
    document.body.appendChild(qrContainer);
    
    // Generate QR code
    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById('qrcode'), {
            text: `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.name)}&am=${amount}&cu=INR`,
            width: 200,
            height: 200
        });
    }
}

// Handle successful payment
function handlePaymentSuccess(response, bookDetails, userDetails) {
    // Save order to database
    const order = {
        id: response.razorpay_payment_id,
        bookId: bookDetails.id,
        bookTitle: bookDetails.title,
        amount: bookDetails.price,
        userName: userDetails.name,
        userEmail: userDetails.email,
        userPhone: userDetails.phone,
        paymentMethod: 'Razorpay',
        status: 'success',
        date: new Date().toISOString(),
        downloadLink: generateDownloadLink(bookDetails.id)
    };
    
    saveOrder(order);
    
    // Send email with download link
    sendOrderEmail(order);
    
    // Show success message with download link
    showOrderSuccess(order);
}

// Generate unique download link
function generateDownloadLink(bookId) {
    const token = btoa(bookId + Date.now() + Math.random()).substring(0, 20);
    return `https://yourdomain.com/download/${token}`;
}

// Save order to localStorage (temporary)
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Send email via EmailJS or backend
function sendOrderEmail(order) {
    // This would integrate with EmailJS or your backend
    console.log('Email sent to:', order.userEmail);
    
    // For demo, show email preview
    showToast(`Download link sent to ${order.userEmail}`, 'success');
}

// Show order success with download
function showOrderSuccess(order) {
    const modal = document.getElementById('successModal');
    const downloadLink = document.getElementById('downloadLink');
    
    downloadLink.innerHTML = `
        <a href="${order.downloadLink}" class="download-btn" target="_blank">
            <i class="fas fa-download"></i> Download Now
        </a>
        <small>Link also sent to your email</small>
    `;
    
    modal.classList.add('show');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
}

// Confirm manual UPI payment
function confirmManualPayment(bookId) {
    const book = booksData.find(b => b.id == bookId);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        showToast('Please login first', 'warning');
        return;
    }
    
    const order = {
        id: 'manual_' + Date.now(),
        bookId: book.id,
        bookTitle: book.title,
        amount: book.price,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        paymentMethod: 'UPI Manual',
        status: 'pending',
        date: new Date().toISOString(),
        downloadLink: generateDownloadLink(book.id)
    };
    
    saveOrder(order);
    showOrderSuccess(order);
    document.querySelector('.qr-modal')?.remove();
}