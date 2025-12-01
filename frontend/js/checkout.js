// Load cart items for checkout
async function loadCheckoutData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Load user data
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            document.getElementById('full-name').value = userData.name || '';
            document.getElementById('address').value = userData.address || '';
        }
        
        // Load cart items
        const { data } = await apiRequest('/cart');
        const checkoutItemsDiv = document.getElementById('checkout-items');
        
        if (data.cart && data.cart.items && data.cart.items.length > 0) {
            checkoutItemsDiv.innerHTML = data.cart.items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb;">
                    <span>${item.product.name} × ${item.quantity}</span>
                    <span>₹${item.product.price * item.quantity}</span>
                </div>
            `).join('');
            
            const subtotal = data.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const total = subtotal + 50;
            
            document.getElementById('checkout-subtotal').textContent = `₹${subtotal}`;
            document.getElementById('checkout-total').textContent = `₹${total}`;
        } else {
            alert('Your cart is empty');
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Error loading checkout data:', error);
    }
}

// Place order
async function placeOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to place order');
        window.location.href = 'login.html';
        return;
    }
    
    const fullName = document.getElementById('full-name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!fullName || !address || !phone) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        const { data } = await apiRequest('/order/create', {
            method: 'POST',
            body: JSON.stringify({
                shippingAddress: address,
                phone,
                paymentMethod
            })
        });
        
        if (data.success) {
            alert('Order placed successfully!');
            window.location.href = 'profile.html';
        } else {
            alert(data.message || 'Failed to place order');
        }
    } catch (error) {
        alert('Failed to place order');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutData();
});


