// frontend/js/admin.js
// Improved admin UI logic + robust adminApiRequest wrapper

// --- Helper: API request wrapper (adds admin token, parses errors)
// Note: Uses API_BASE_URL from api.js (loaded before this file)
async function adminApiRequest(path, opts = {}) {
  const baseUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : '/api';
  const url = baseUrl + path;
  const token = localStorage.getItem('adminToken');

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const fetchOpts = {
    method: opts.method || 'GET',
    headers: Object.assign({}, defaultHeaders, opts.headers || {}),
    body: opts.body || undefined
  };

  // Attach token if available
  if (token) {
    fetchOpts.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, fetchOpts);

    // If 401/403 — redirect to login
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = 'admin-login.html';
      return { success: false, status: res.status };
    }

    // Try to parse JSON
    const text = await res.text();
    let data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const msg = (data && data.message) ? data.message : `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return { success: true, status: res.status, data };
  } catch (err) {
    console.error('adminApiRequest error:', err);
    throw err;
  }
}

// --- Load admin products
async function loadAdminProducts() {
  try {
    const result = await adminApiRequest('/admin/products');
    const data = result.data || {};
    const tableBody = document.getElementById('admin-products-table');

    if (data.products && data.products.length > 0) {
      tableBody.innerHTML = data.products
        .map(
          (product) => `
        <tr>
          <td><img src="${escapeHtml(product.image || 'https://via.placeholder.com/80')}" 
                   alt="${escapeHtml(product.name)}"
                   onerror="this.src='https://via.placeholder.com/80'"></td>
          <td>${escapeHtml(product.name)}</td>
          <td>${escapeHtml(product.category)}</td>
          <td>₹${Number(product.price).toFixed(2)}</td>
          <td>${Number(product.stock)}</td>
          <td>
            <div class="action-buttons">
              <button class="btn-secondary" onclick="editProduct('${product._id}')">Edit</button>
              <button class="btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
            </div>
          </td>
        </tr>
      `
        )
        .join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Failed to load products.');
  }
}

// --- Show add product modal
function showAddProductModal() {
  document.getElementById('modal-title').textContent = 'Add Product';
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
  document.getElementById('product-modal').style.display = 'flex';
}

// --- Close modal
function closeProductModal() {
  document.getElementById('product-modal').style.display = 'none';
}

// --- Edit product
async function editProduct(productId) {
  try {
    const result = await adminApiRequest(`/admin/products/${productId}`);
    const product = result.data.product;

    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product._id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.image || '';

    document.getElementById('product-modal').style.display = 'flex';
  } catch (err) {
    console.error(err);
    alert('Failed to load product');
  }
}

// --- Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const result = await adminApiRequest(`/admin/products/${productId}`, {
      method: 'DELETE'
    });

    if (result.data.success) {
      alert('Product deleted');
      loadAdminProducts();
    } else {
      alert('Failed to delete product');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to delete product');
  }
}

// --- Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Submit product form (will be attached in DOMContentLoaded)
function setupProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productId = document.getElementById('product-id').value;

  const productData = {
    name: document.getElementById('product-name').value.trim(),
    category: document.getElementById('product-category').value.trim(),
    price: parseFloat(document.getElementById('product-price').value),
    stock: parseInt(document.getElementById('product-stock').value),
    description: document.getElementById('product-description').value.trim(),
    image: document.getElementById('product-image').value.trim()
  };

  try {
    let result;

    if (productId) {
      // Update
      result = await adminApiRequest(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    } else {
      // Add
      result = await adminApiRequest('/admin/products/add', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    }

    if (result.data.success) {
      alert(productId ? 'Product updated' : 'Product added');
      closeProductModal();
      loadAdminProducts();
    } else {
      alert('Failed to save product');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to save product');
  }
  });
}

// --- Logout admin
function logoutAdmin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
  window.location.href = 'admin-login.html';
}

// --- Close modal click outside
window.onclick = function (event) {
  const modal = document.getElementById('product-modal');
  if (event.target === modal) closeProductModal();
};

// --- Tab Switching
function switchTab(tabName, event) {
  // Hide all tab contents
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  document.getElementById(`${tabName}-tab`).classList.add('active');
  
  // Add active class to clicked tab
  if (event && event.target) {
    event.target.classList.add('active');
  } else {
    // Fallback: find the button by text content
    document.querySelectorAll('.admin-tab').forEach(tab => {
      if (tab.textContent.trim().toLowerCase() === tabName || 
          (tabName === 'users' && tab.textContent.includes('Users')) ||
          (tabName === 'orders' && tab.textContent.includes('Orders')) ||
          (tabName === 'delivery' && tab.textContent.includes('Delivery')) ||
          (tabName === 'products' && tab.textContent.includes('Products'))) {
        tab.classList.add('active');
      }
    });
  }
  
  // Load data based on tab
  if (tabName === 'users') {
    loadUsers();
  } else if (tabName === 'orders') {
    loadOrders();
  } else if (tabName === 'delivery') {
    loadDelivery();
  } else if (tabName === 'products') {
    loadAdminProducts();
  }
}

// --- Load Users
async function loadUsers() {
  try {
    const result = await adminApiRequest('/admin/users');
    const data = result.data || {};
    const tableBody = document.getElementById('users-table-body');

    if (data.users && data.users.length > 0) {
      tableBody.innerHTML = data.users
        .map(
          (user) => `
        <tr>
          <td>${escapeHtml(user.name)}</td>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.address || 'N/A')}</td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading users:', error);
    document.getElementById('users-table-body').innerHTML = '<tr><td colspan="4">Failed to load users</td></tr>';
  }
}

// --- Load Orders
async function loadOrders() {
  try {
    const result = await adminApiRequest('/admin/orders');
    const data = result.data || {};
    const tableBody = document.getElementById('orders-table-body');

    if (data.orders && data.orders.length > 0) {
      tableBody.innerHTML = data.orders
        .map(
          (order) => `
        <tr>
          <td>${escapeHtml(order.orderNumber || (order._id ? order._id.slice(-8) : 'N/A'))}</td>
          <td>
            <strong>${escapeHtml(order.user?.name || 'N/A')}</strong><br>
            <small>${escapeHtml(order.user?.email || '')}</small>
          </td>
          <td>
            ${(order.items || []).map(item => `
              <div>${escapeHtml(item.product?.name || 'N/A')} × ${item.quantity || 0}</div>
            `).join('')}
          </td>
          <td>₹${Number(order.totalAmount).toFixed(2)}</td>
          <td><span class="status-badge status-${order.status}">${order.status}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    document.getElementById('orders-table-body').innerHTML = '<tr><td colspan="6">Failed to load orders</td></tr>';
  }
}

// --- Load Delivery Information
async function loadDelivery() {
  try {
    const result = await adminApiRequest('/admin/orders');
    const data = result.data || {};
    const tableBody = document.getElementById('delivery-table-body');

    if (data.orders && data.orders.length > 0) {
      tableBody.innerHTML = data.orders
        .map(
          (order) => `
        <tr>
          <td>${escapeHtml(order.orderNumber || (order._id ? order._id.slice(-8) : 'N/A'))}</td>
          <td>
            <strong>${escapeHtml(order.user?.name || 'N/A')}</strong><br>
            <small>${escapeHtml(order.user?.email || '')}</small>
          </td>
          <td>${escapeHtml(order.shippingAddress || 'N/A')}</td>
          <td>${escapeHtml(order.phone || 'N/A')}</td>
          <td>${escapeHtml(order.paymentMethod || 'cod').toUpperCase()}</td>
          <td><span class="status-badge status-${order.status}">${order.status}</span></td>
          <td>
            <select class="status-select" onchange="updateOrderStatus('${order._id || ''}', this.value)">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
      `
        )
        .join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="8">No orders found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading delivery:', error);
    document.getElementById('delivery-table-body').innerHTML = '<tr><td colspan="8">Failed to load delivery information</td></tr>';
  }
}

// --- Update Order Status
async function updateOrderStatus(orderId, newStatus) {
  if (!confirm(`Are you sure you want to update order status to "${newStatus}"?`)) {
    // Reload to reset the select dropdown
    loadDelivery();
    return;
  }

  try {
    const result = await adminApiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });

    if (result.data.success) {
      alert('Order status updated successfully');
      loadDelivery();
      // Also refresh orders tab if it's visible
      const ordersTab = document.getElementById('orders-tab');
      if (ordersTab && ordersTab.classList.contains('active')) {
        loadOrders();
      }
    } else {
      alert('Failed to update order status');
      loadDelivery();
    }
  } catch (err) {
    console.error(err);
    alert('Failed to update order status');
    loadDelivery();
  }
}

// --- Init
document.addEventListener('DOMContentLoaded', () => {
  // Setup product form
  setupProductForm();
  
  // Load default tab (Users)
  loadUsers();
});
