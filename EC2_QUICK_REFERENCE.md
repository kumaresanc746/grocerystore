# ⚡ EC2 Ubuntu Quick Reference

Quick commands for deploying Grocery Store on EC2 Ubuntu instance.

## 🚀 One-Command Setup (After EC2 Launch)

```bash
# Run this on your EC2 Ubuntu instance after connecting via SSH
curl -fsSL https://raw.githubusercontent.com/your-repo/setup.sh | bash
```

**OR** Manual step-by-step:

## 📋 Complete Setup Commands

### 1. Initial Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl wget git vim unzip
```

### 2. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

### 3. Install Docker
```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Log out and back in for group to take effect
exit
# Reconnect via SSH
```

### 4. Deploy Application
```bash
# Create project directory
mkdir -p ~/grocery-store
cd ~/grocery-store

# Upload your project files here (via SCP, Git, or S3)
# Then:

# Configure backend
cd backend
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocery-store
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Install dependencies
npm install

# Go back to root
cd ~/grocery-store

# Update frontend API URL
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sed -i "s|const API_BASE_URL = '.*'|const API_BASE_URL = 'http://${EC2_IP}:3000/api'|g" frontend/js/api.js

# Start services
docker compose up -d --build

# Check status
docker compose ps
```

### 5. Verify Deployment
```bash
# Check containers
docker ps

# Test backend
curl http://localhost:3000/health

# Test frontend
curl http://localhost/health

# View logs
docker compose logs -f
```

## 🔧 Common Operations

### Start/Stop Services
```bash
# Start
cd ~/grocery-store && docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# View logs
docker compose logs -f
```

### Update Application
```bash
cd ~/grocery-store
git pull  # or upload new files
docker compose up -d --build
```

### Check Status
```bash
# Containers
docker ps

# System resources
htop
free -h
df -h

# Docker resources
docker stats
```

### Backup MongoDB
```bash
docker exec grocery-mongo mongodump --out /tmp/backup
docker cp grocery-mongo:/tmp/backup ~/backup_$(date +%Y%m%d)
```

## 🌐 Access URLs

Replace `YOUR_EC2_IP` with your actual EC2 public IP:

- **Frontend**: http://YOUR_EC2_IP
- **Backend API**: http://YOUR_EC2_IP:3000/api
- **Health Check**: http://YOUR_EC2_IP:3000/health
- **Mongo Express**: http://YOUR_EC2_IP:8081 (admin/admin123)

## 🔒 Security Group Rules

Ensure these ports are open in AWS Security Group:

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP | SSH |
| 80 | TCP | 0.0.0.0/0 | Frontend |
| 3000 | TCP | 0.0.0.0/0 | Backend API |
| 8081 | TCP | 0.0.0.0/0 | Mongo Express |

## 🆘 Troubleshooting

### Can't connect via SSH
```bash
# Check security group allows port 22 from your IP
# Verify key file permissions: chmod 400 key.pem
```

### Docker permission denied
```bash
sudo usermod -aG docker ubuntu
# Log out and back in
```

### Port already in use
```bash
sudo lsof -i :3000
# Kill process or change port in docker-compose.yml
```

### Application not accessible
```bash
# Check containers
docker ps

# Check logs
docker compose logs

# Check security group
# Test locally: curl http://localhost:3000/health
```

## 📚 Full Documentation

For complete detailed guide, see: **[EC2_UBUNTU_DEPLOYMENT_GUIDE.md](./EC2_UBUNTU_DEPLOYMENT_GUIDE.md)**

