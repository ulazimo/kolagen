// ========================================
// KOLAGEN PURE - Website JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initCart();
    initOrderForm();
    initTestimonialsSlider();
    initSmoothScroll();
    initAnimations();
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
}

// ========================================
// SHOPPING CART
// ========================================
function initCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    let cart = [];

    const products = {
        pure: { name: 'Kolagen Peptidi Pure', price: 3490 },
        marine: { name: 'Kolagen Marine', price: 4290 },
        beauty: { name: 'Kolagen Beauty+', price: 4990 }
    };

    // Open cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close cart
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Close cart and scroll to order on checkout
    checkoutBtn.addEventListener('click', () => {
        closeCart();
    });

    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            const product = products[productId];

            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }

            updateCart();
            showAddedNotification(product.name);

            // Open cart briefly
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Update cart display
    function updateCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Vaša korpa je prazna</p>';
            cartTotal.textContent = '0 RSD';
            cartCount.textContent = '0';
            return;
        }

        let html = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <div class="cart-jar-mini"></div>
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Količina: ${item.quantity}</p>
                        <div class="cart-item-price">${itemTotal.toLocaleString('sr-RS')} RSD</div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        cartTotal.textContent = `${total.toLocaleString('sr-RS')} RSD`;
        cartCount.textContent = count;

        // Add remove event listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }

    // Show notification
    function showAddedNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${productName} dodat u korpu</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #A38C5E;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1002;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// ORDER FORM
// ========================================
function initOrderForm() {
    const form = document.getElementById('orderForm');
    const productSelect = document.getElementById('product');
    const quantitySelect = document.getElementById('quantity');
    const summaryProduct = document.getElementById('summaryProduct');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');

    const prices = {
        pure: 3490,
        marine: 4290,
        beauty: 4990
    };

    const productNames = {
        pure: 'Kolagen Peptidi Pure',
        marine: 'Kolagen Marine',
        beauty: 'Kolagen Beauty+'
    };

    const shippingCost = 290;
    const freeShippingThreshold = 5000;

    function updateSummary() {
        const productId = productSelect.value;
        const quantity = parseInt(quantitySelect.value);

        if (!productId) {
            summaryProduct.textContent = '-';
            summaryQuantity.textContent = quantity;
            summaryTotal.textContent = '0 RSD';
            return;
        }

        const productPrice = prices[productId];
        let subtotal = productPrice * quantity;

        // Apply 10% discount for 3 items
        if (quantity === 3) {
            subtotal = Math.round(subtotal * 0.9);
        }

        const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
        const total = subtotal + shipping;

        summaryProduct.textContent = productNames[productId];
        summaryQuantity.textContent = quantity;
        summaryShipping.textContent = shipping === 0 ? 'Besplatno' : `${shipping} RSD`;
        summaryTotal.textContent = `${total.toLocaleString('sr-RS')} RSD`;
    }

    productSelect.addEventListener('change', updateSummary);
    quantitySelect.addEventListener('change', updateSummary);

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate
        if (!data.name || !data.email || !data.phone || !data.address || !data.city || !data.zip || !data.product) {
            showFormMessage('Molimo popunite sva obavezna polja.', 'error');
            return;
        }

        // Simulate order submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Slanje...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage('Hvala na porudžbini! Kontaktiraćemo vas uskoro.', 'success');
            form.reset();
            updateSummary();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    function showFormMessage(message, type) {
        // Remove existing message
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `form-message form-message-${type}`;
        msg.textContent = message;
        msg.style.cssText = `
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 500;
            ${type === 'success'
                ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
                : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;

        form.insertBefore(msg, form.firstChild);

        setTimeout(() => msg.remove(), 5000);
    }
}

// ========================================
// TESTIMONIALS SLIDER
// ========================================
function initTestimonialsSlider() {
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const cards = document.querySelectorAll('.testimonial-card');

    if (dots.length === 0 || window.innerWidth > 768) return;

    let currentSlide = 0;

    function showSlide(index) {
        cards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance on mobile
    if (window.innerWidth <= 768) {
        showSlide(0);
        setInterval(() => {
            currentSlide = (currentSlide + 1) % cards.length;
            showSlide(currentSlide);
        }, 5000);
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.product-card, .benefit-card, .science-card, .testimonial-card, .eco-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format number with Serbian locale
function formatPrice(price) {
    return price.toLocaleString('sr-RS');
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// NEWSLETTER FORM
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = newsletterForm.querySelector('input[type="email"]').value;

            if (!email) return;

            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Prijavljeni!';
                newsletterForm.querySelector('input').value = '';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
});
