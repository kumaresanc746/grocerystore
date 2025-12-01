// Inside frontend container, use Docker network name
const API_BASE_URL = "http://13.62.76.73:3000/api";
// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

function getAdminToken() {
    return localStorage.getItem('adminToken');
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok && response.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('login')) {
                window.location.href = 'login.html';
            }
        }
        
        return { response, data };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function adminApiRequest(endpoint, options = {}) {
    const token = getAdminToken();
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok && response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            window.location.href = 'admin-login.html';
        }
        
        return { response, data };
    } catch (error) {
        console.error('Admin API Error:', error);
        throw error;
    }
}


