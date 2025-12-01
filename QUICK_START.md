# ⚡ Quick Start Guide

Get the Grocery Store project running in 5 minutes!

## 🎯 Fastest Path: Docker Compose

### Step 1: Install Docker
- Download: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

### Step 2: Clone/Download Project
```bash
# If you have Git:
git clone <repository-url>
cd grocery-store

# Or extract the ZIP file you downloaded
```

### Step 3: Start Everything
```bash
docker-compose up -d --build
```

### Step 4: Access Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **Mongo Express**: http://localhost:8081 (admin/admin123)

### Step 5: Test Login
- **Admin**: `admin@grocerystore.com` / `admin123`
- **User**: Create account via Signup page

**That's it! 🎉**

---

## 📋 What You Need (Minimum)

For **Docker Compose** (easiest):
- ✅ Docker Desktop
- ✅ 4GB RAM
- ✅ Internet connection

For **Local Development** (without Docker):
- ✅ Node.js 18+
- ✅ MongoDB 7.0+
- ✅ Web browser

For **Full Deployment** (AWS/Kubernetes):
- ✅ All prerequisites from [REQUIREMENTS_AND_SETUP.md](./REQUIREMENTS_AND_SETUP.md)

---

## 🚀 Next Steps

1. **Explore the Application**
   - Browse products
   - Add items to cart
   - Create orders
   - Try admin dashboard

2. **Customize Configuration**
   - See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

3. **Deploy to Production**
   - See [REQUIREMENTS_AND_SETUP.md](./REQUIREMENTS_AND_SETUP.md)

4. **Read Full Documentation**
   - See [README.md](./README.md)

---

## 🆘 Troubleshooting

**Docker not starting?**
```bash
# Check Docker is running
docker ps

# Restart Docker Desktop
# Windows/Mac: Restart Docker Desktop app
# Linux: sudo systemctl restart docker
```

**Port already in use?**
```bash
# Edit docker-compose.yml
# Change port mappings:
# "80:80" → "8080:80"
# "3000:3000" → "3001:3000"
```

**Can't access frontend?**
```bash
# Check containers are running
docker-compose ps

# Check logs
docker-compose logs frontend

# Restart services
docker-compose restart
```

**Backend not connecting to MongoDB?**
```bash
# Check MongoDB container
docker-compose logs mongo

# Restart all services
docker-compose down
docker-compose up -d
```

---

## 📚 Full Documentation

- **[README.md](./README.md)** - Complete project documentation
- **[REQUIREMENTS_AND_SETUP.md](./REQUIREMENTS_AND_SETUP.md)** - All requirements and setup steps
- **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - How to customize configuration files
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Project structure overview

---

**Need Help?** Check the troubleshooting section in README.md or REQUIREMENTS_AND_SETUP.md

