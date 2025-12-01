// Load products
async function loadProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || document.getElementById('category-filter')?.value || '';
    const search = document.getElementById('search-input')?.value || '';
    
    let endpoint = '/products?';
    if (category) endpoint += `category=${category}&`;
    if (search) endpoint += `search=${encodeURIComponent(search)}&`;
    
    try {
        const { data } = await apiRequest(endpoint);
        const productsGrid = document.getElementById('products-grid');
        
        if (data.products && data.products.length > 0) {
            productsGrid.innerHTML = data.products.map(product => `
                <div class="product-card" onclick="window.location.href='product-details.html?id=${product._id}'">
                    <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300'">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">₹${product.price}</p>
                        <div class="product-actions">
                            <button class="btn-primary" onclick="event.stopPropagation(); addToCart('${product._id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            productsGrid.innerHTML = '<p>No products found</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Add to cart
async function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const { data } = await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        
        if (data.success) {
            alert('Item added to cart!');
            updateCartCount();
        }
    } catch (error) {
        alert('Failed to add item to cart');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) categoryFilter.value = category;
    }
    loadProducts();
});

