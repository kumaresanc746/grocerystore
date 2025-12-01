// Load product details
async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    try {
        const { data } = await apiRequest(`/products/${productId}`);
        const productDetails = document.getElementById('product-details');
        
        if (data.product) {
            const product = data.product;
            productDetails.innerHTML = `
                <div>
                    <img src="${product.image || 'https://via.placeholder.com/500'}" alt="${product.name}" class="product-details-image" onerror="this.src='https://via.placeholder.com/500'">
                </div>
                <div class="product-details-info">
                    <h1>${product.name}</h1>
                    <p class="product-category">${product.category}</p>
                    <p class="product-details-price">₹${product.price}</p>
                    <p class="product-details-description">${product.description || 'No description available'}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
                        <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${product.stock || 10}">
                        <button class="quantity-btn" onclick="increaseQuantity()">+</button>
                        <span style="margin-left: 1rem; color: #6b7280;">In Stock: ${product.stock || 0}</span>
                    </div>
                    <button class="btn-primary" onclick="addToCartFromDetails('${product._id}')">Add to Cart</button>
                </div>
            `;
        } else {
            productDetails.innerHTML = '<p>Product not found</p>';
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    const max = parseInt(input.max);
    const current = parseInt(input.value);
    if (current < max) {
        input.value = current + 1;
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    const current = parseInt(input.value);
    if (current > 1) {
        input.value = current - 1;
    }
}

async function addToCartFromDetails(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value);
    
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
    loadProductDetails();
});


