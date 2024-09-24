// Select relevant DOM elements
const thumbnails = document.querySelectorAll('.thumbnail img');
const mainImage = document.querySelector('.product-list .product img');
const plusBtn = document.querySelector('.plus');
const quantityInput = document.getElementById('quantity');
const minusBtn = document.querySelector('.minus');
const addToCartBtn = document.querySelector('.AddToCart');
const cartIcon = document.querySelector('.cartLogo');
const cartContent = document.querySelector('.cart-content');
const cartItemsContainer = document.querySelector('.cart-items-container');
const totalPriceElement = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const cartCount = document.querySelector('.cart-count');
const cartMessage = document.getElementById('cart-message');
const emptyMsg = document.querySelector('.emptyMsg');
const mobileMenuIcon = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const prevImageBtn = document.querySelector('.prev');
const nextImageBtn = document.querySelector('.next');
const closeBtn = document.querySelector('.close');

// Cart data
let cart = [];
let totalItems = 0;

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

// Disable lightbox on small screens
mainImage.addEventListener('click', (e) => {
    if (window.innerWidth <= 767) {
        e.preventDefault();
        return;
    }
    showLightbox(0);
});

// Lightbox functionality
let currentIndex = 0;

function showLightbox(index) {
    currentIndex = index;
    lightbox.style.display = 'block';
    updateLightboxImage();
    updateLightboxThumbnails();
}

function updateLightboxImage() {
    lightboxImg.src = thumbnails[currentIndex].src.replace('-thumbnail', '');
}

function updateLightboxThumbnails() {
    const lightboxThumbnails = document.querySelector('.lightbox-thumbnails');
    lightboxThumbnails.innerHTML = '';
  
    thumbnails.forEach((thumbnail, index) => {
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbnail.src;
        thumbImg.classList.add('lightbox-thumbnail');
        if (index === currentIndex) {
            thumbImg.classList.add('selected');
        }
        thumbImg.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            updateLightboxThumbnails();
        });
        lightboxThumbnails.appendChild(thumbImg);
    });
}

// Image navigation
function updateMainImage() {
    mainImage.src = thumbnails[currentIndex].src.replace('-thumbnail', '');
    thumbnails.forEach((thumb, index) => {
        thumb.parentElement.classList.toggle('selected', index === currentIndex);
    });
}

// Close the lightbox
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});

// Prev and next button functionality for both lightbox and main image
prevImageBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    if (window.innerWidth > 767) {
        updateLightboxImage();
        updateLightboxThumbnails();
    } else {
        updateMainImage();
    }
});

nextImageBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    if (window.innerWidth > 767) {
        updateLightboxImage();
        updateLightboxThumbnails();
    } else {
        updateMainImage();
    }
});

// Add to cart functionality
addToCartBtn.addEventListener('click', () => {
    const productName = document.querySelector('.EditionTitle').textContent;
    const productPrice = parseFloat(document.querySelector('.price').textContent.replace('$', ''));
    const quantity = parseInt(quantityInput.value);
    const thumbnailSrc = mainImage.src.replace('image-product-1.jpg', 'image-product-1-thumbnail.jpg');
  
    // Find if item with the same thumbnail already exists in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.thumbnail === thumbnailSrc);
  
    if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add item to the cart array
        const item = {
            name: productName,
            price: productPrice,
            quantity: quantity,
            thumbnail: thumbnailSrc,
        };
        cart.push(item);
    }
  
    totalItems += quantity;
  
    // Update cart count
    cartCount.textContent = totalItems;
  
    // Show cart items
    updateCartPopup();
});

// Update cart popup content
function updateCartPopup() {
    cartItemsContainer.innerHTML = ''; // Clear previous cart items
  
    let total = 0;
  
    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        totalPriceElement.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        totalPriceElement.style.display = 'block';
        checkoutBtn.style.display = 'block';
    
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
      
            cartItem.innerHTML = `
                <img class="cart-thumbnail" src="${item.thumbnail}" alt="${item.name}">
                <div class="cart-product-details">
                    <p>${item.name}</p>
                    <p class="price-details">${item.quantity} x $${item.price.toFixed(2)} = <b style="opacity=1" class="smallTotal">$${(item.price * item.quantity).toFixed(2)}</b></p>
                </div>
                <button class="delete-btn" data-name="${item.name}">
                    <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <defs>
                        <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/>
                    </defs>
                    <use fill="#ff0000" fill-rule="nonzero" xlink:href="#a"/>
                    </svg>
                </button>
            `;
      
            // Add the item to the container
            cartItemsContainer.appendChild(cartItem);
      
            // Calculate total price
            total += item.price * item.quantity;
        });
    
        // Update the total price element
        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
    }
  
    // Show the cart content when items are added
    cartContent.classList.add('visible');
  
    // Attach delete event to all delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            removeFromCart(itemName);
        });
    });
}

// Remove item from the cart
function removeFromCart(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex >= 0) {
        totalItems -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);
    }
  
    updateCartPopup();
    cartCount.textContent = totalItems;
}

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        cart = [];
        totalItems = 0;
        cartCount.textContent = '0';
        updateCartPopup();
        cartContent.classList.remove('visible');
    }
});

// Show/Hide cart popup when cart icon is clicked
cartIcon.addEventListener('click', () => {
    cartContent.classList.toggle('visible');
});

// Increase quantity
plusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value);
    quantityInput.value = currentQuantity + 1;
});

// Decrease quantity
minusBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
});

// Switching main image by pressing a thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', function () {
        mainImage.src = thumbnail.src.replace('-thumbnail', '');
        thumbnails.forEach((thumb) => thumb.parentElement.classList.remove('selected'));
        thumbnail.parentElement.classList.add('selected');
        currentIndex = index;
    });
});
