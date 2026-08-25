// --- Cart State Management ---
let cart = [];

// DOM Elements
const navCartBtn = document.getElementById('nav-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');

// Open / Close Cart Drawer
function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

navCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Add Product To Cart Array
function addToCart(title, price, quantity) {
    const existingIndex = cart.findIndex(item => item.title === title);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ title, price, quantity });
    }
    
    updateCartUI();
    openCart();
}

// Remove Product From Cart
function removeFromCart(title) {
    cart = cart.filter(item => item.title !== title);
    updateCartUI();
}

// Update UI (Cart Counter, Items, and Total)
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    navCartBtn.textContent = `🛒 Cart (${totalItems})`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.title}')">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Checkout Button Event
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your order! Proceeding to checkout...");
        cart = [];
        updateCartUI();
        closeCart();
    }
});

// --- 1. Featured Showcase Controls ---
const mainImg = document.getElementById('main-product-img');
const thumbs = document.querySelectorAll('.thumb');
const colorDots = document.querySelectorAll('.color-dot');
const qtyVal = document.getElementById('qty-value');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const mainAddCartBtn = document.getElementById('main-add-cart-btn');

let currentQty = 1;

thumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
        thumbs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        mainImg.src = e.target.src;
    });
});

colorDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        colorDots.forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
        const newImgSrc = e.target.getAttribute('data-img');
        if (newImgSrc) mainImg.src = newImgSrc;
    });
});

if (qtyPlus && qtyMinus) {
    qtyPlus.addEventListener('click', () => {
        currentQty++;
        qtyVal.textContent = currentQty;
    });

    qtyMinus.addEventListener('click', () => {
        if (currentQty > 1) {
            currentQty--;
            qtyVal.textContent = currentQty;
        }
    });
}

if (mainAddCartBtn) {
    mainAddCartBtn.addEventListener('click', () => {
        addToCart("Wireless Noise-Canceling Headphones", 17.99, currentQty);
        currentQty = 1;
        qtyVal.textContent = currentQty;
    });
}

// --- 2. Product Grid Add to Cart ---
const gridCards = document.querySelectorAll('.product-card');

gridCards.forEach(card => {
    const btn = card.querySelector('.add-to-cart-btn');
    const title = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('$', ''));

    btn.addEventListener('click', () => {
        addToCart(title, price, 1);
    });
});