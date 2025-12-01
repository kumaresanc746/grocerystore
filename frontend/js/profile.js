// Show tab
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Load orders
async function loadOrders() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const { data } = await apiRequest('/order/history');
        const ordersList = document.getElementById('orders-list');
        
        if (data.orders && data.orders.length > 0) {
            ordersList.innerHTML = data.orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>Order #${order.orderNumber || order._id.slice(-8)}</h3>
                            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                    <div>
                        ${order.items.map(item => `
                            <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                                <span>${item.product.name} × ${item.quantity}</span>
                                <span>₹${item.product.price * item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                        <strong>Total: ₹${order.totalAmount}</strong>
                    </div>
                    <p style="margin-top: 0.5rem; color: #6b7280;">Shipping: ${order.shippingAddress}</p>
                </div>
            `).join('');
        } else {
            ordersList.innerHTML = '<p>No orders yet</p>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Load user settings
async function loadSettings() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('settings-name').value = user.name || '';
        document.getElementById('settings-email').value = user.email || '';
        document.getElementById('settings-address').value = user.address || '';
    }
}

// Update profile
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('settings-name').value;
    const email = document.getElementById('settings-email').value;
    const address = document.getElementById('settings-address').value;
    
    try {
        const { data } = await apiRequest('/user/update', {
            method: 'PUT',
            body: JSON.stringify({ name, email, address })
        });
        
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Profile updated successfully');
        }
    } catch (error) {
        alert('Failed to update profile');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadSettings();
});


