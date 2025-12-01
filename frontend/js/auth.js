// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        const userData = JSON.parse(user);
        const authLinks = document.getElementById('auth-links');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = userData.name;
        
        return true;
    }
    
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function logoutAdmin() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = 'admin-login.html';
}

// Update cart count
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => el.textContent = '0');
        return;
    }
    
    try {
        const { data } = await apiRequest('/cart');
        const count = data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => el.textContent = count);
    } catch (error) {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => el.textContent = '0');
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateCartCount();
    setInterval(updateCartCount, 30000); // Update every 30 seconds
});


