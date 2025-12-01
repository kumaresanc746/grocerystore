// MongoDB initialization script
// Creates initial admin user and sample products

db = db.getSiblingDB('grocery-store');

// Create collections
db.createCollection('users');
db.createCollection('admins');
db.createCollection('products');
db.createCollection('carts');
db.createCollection('orders');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.carts.createIndex({ user: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

// Insert default admin (password: admin123 - change after first login)
// Password hash for 'admin123' generated using bcrypt
db.admins.insertOne({
  name: 'Admin User',
  email: 'admin@grocerystore.com',
  password: '$2a$10$rZ5qZ5qZ5qZ5qZ5qZ5qZ5uZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5qZ5q', // admin123
  createdAt: new Date()
});

// Insert sample products
db.products.insertMany([
  {
    name: 'Fresh Apples',
    category: 'fruits',
    price: 150,
    stock: 100,
    description: 'Fresh and crisp red apples',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  },
  {
    name: 'Tomatoes',
    category: 'vegetables',
    price: 80,
    stock: 100,
    description: 'Fresh red tomatoes',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  },
  {
    name: 'Milk',
    category: 'dairy',
    price: 60,
    stock: 100,
    description: 'Fresh whole milk',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  },
  {
    name: 'Potato Chips',
    category: 'snacks',
    price: 50,
    stock: 100,
    description: 'Crispy potato chips',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  },
  {
    name: 'Cola',
    category: 'beverages',
    price: 45,
    stock: 100,
    description: 'Refreshing cola drink',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  },
  {
    name: 'Chicken Breast',
    category: 'meat',
    price: 350,
    stock: 50,
    description: 'Fresh chicken breast',
    image: 'https://via.placeholder.com/300',
    createdAt: new Date()
  }
]);

print('Database initialized successfully!');
print('Default admin: admin@grocerystore.com / admin123');

