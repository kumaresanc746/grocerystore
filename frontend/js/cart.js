// Load cart items
async function loadCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('cart-items').innerHTML = '<p>Please login to view your cart</p>';
        return;
    }
    
    try {
        const { data } = await apiRequest('/cart');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        
        if (data.cart && data.cart.items && data.cart.items.length > 0) {
            cartItemsDiv.innerHTML = data.cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.product.image || 'https://via.placeholder.com/120'}" alt="${item.product.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/120'">
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.product.name}</h3>
                        <p class="product-category">${item.product.category}</p>
                        <p class="cart-item-price">₹${item.product.price} × ${item.quantity} = ₹${item.product.price * item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="updateCartItem('${item.product._id}', ${item.quantity - 1})">-</button>
                            <span class="quantity-input">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartItem('${item.product._id}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn-danger" onclick="removeFromCart('${item.product._id}')">Remove</button>
                    </div>
                </div>
            `).join('');
            
            const subtotal = data.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const total = subtotal + 50; // Delivery charge
            
            document.getElementById('subtotal').textContent = `₹${subtotal}`;
            document.getElementById('total').textContent = `₹${total}`;
            cartSummary.style.display = 'block';
        } else {
            cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
            cartSummary.style.display = 'none';
        }
        
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart item quantity
async function updateCartItem(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    try {
        const { data } = await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        
        if (data.success) {
            loadCart();
        }
    } catch (error) {
        alert('Failed to update cart');
    }
}

// Remove from cart
async function removeFromCart(productId) {
    try {
        const { data } = await apiRequest('/cart/remove', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        
        if (data.success) {
            loadCart();
        }
    } catch (error) {
        alert('Failed to remove item');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});


