# 🚀 Complete EC2 Ubuntu Deployment Guide

This guide will help you deploy the entire Grocery E-Commerce project on a single EC2 Ubuntu instance, from basic setup to full production deployment.

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Launch EC2 Ubuntu Instance](#2-launch-ec2-ubuntu-instance)
3. [Connect to EC2 Instance](#3-connect-to-ec2-instance)
4. [Initial Server Setup](#4-initial-server-setup)
5. [Install All Required Software](#5-install-all-required-software)
6. [Deploy Application](#6-deploy-application)
7. [Configure Security Groups](#7-configure-security-groups)
8. [Access Application](#8-access-application)
9. [Production Setup](#9-production-setup)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

### What You Need Before Starting

- ✅ AWS Account (free tier available)
- ✅ Credit card (for AWS account verification)
- ✅ Basic knowledge of Linux commands
- ✅ SSH client (built-in on Mac/Linux, PuTTY for Windows)

### Estimated Costs
- **t3.medium instance**: ~$30/month (or use free tier t2.micro)
- **Storage**: ~$5/month for 20GB
- **Data transfer**: First 1GB free, then ~$0.09/GB

---

## 2. Launch EC2 Ubuntu Instance

### Step 1: Login to AWS Console

1. Go to https://aws.amazon.com/
2. Click "Sign In" → Enter your credentials
3. Navigate to **EC2 Dashboard**

### Step 2: Create Key Pair

1. In EC2 Dashboard, click **"Key Pairs"** (left sidebar)
2. Click **"Create key pair"**
3. Configure:
   - **Name**: `grocery-store-key`
   - **Key pair type**: RSA
   - **File format**: `.pem` (for OpenSSH)
4. Click **"Create key pair"**
5. **Download** the `.pem` file and save it securely
   - **Location**: `~/.ssh/grocery-store-key.pem` (Linux/Mac)
   - **Location**: `C:\Users\YourName\.ssh\grocery-store-key.pem` (Windows)

### Step 3: Launch EC2 Instance

1. In EC2 Dashboard, click **"Launch Instance"**

2. **Name your instance**:
   - Name: `grocery-store-server`

3. **Choose AMI (Amazon Machine Image)**:
   - Search: `Ubuntu`
   - Select: **Ubuntu Server 22.04 LTS** (Free tier eligible)
   - Architecture: `64-bit (x86)`

4. **Choose Instance Type**:
   - For testing: **t2.micro** (Free tier eligible, 1 vCPU, 1GB RAM)
   - For production: **t3.medium** (2 vCPU, 4GB RAM) - Recommended
   - Click **"Next: Configure Instance Details"**

5. **Configure Instance Details**:
   - Number of instances: `1`
   - Network: Default VPC (or create new)
   - Subnet: Any availability zone
   - Auto-assign Public IP: **Enable**
   - Click **"Next: Add Storage"**

6. **Add Storage**:
   - Size: `20 GB` (minimum, 30GB recommended)
   - Volume type: `gp3` (General Purpose SSD)
   - Click **"Next: Add Tags"**

7. **Add Tags** (Optional):
   - Key: `Name`
   - Value: `grocery-store-server`
   - Click **"Next: Configure Security Group"**

8. **Configure Security Group**:
   - Security group name: `grocery-store-sg`
   - Description: `Security group for grocery store application`
   
   **Add Rules** (click "Add rule" for each):
   
   | Type | Protocol | Port Range | Source | Description |
   |------|----------|------------|--------|-------------|
   | SSH | TCP | 22 | My IP | SSH access |
   | HTTP | TCP | 80 | 0.0.0.0/0 | Web access |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS access |
   | Custom TCP | TCP | 3000 | 0.0.0.0/0 | Backend API |
   | Custom TCP | TCP | 8081 | 0.0.0.0/0 | Mongo Express |
   | Custom TCP | TCP | 8080 | 0.0.0.0/0 | Jenkins (optional) |
   
   Click **"Review and Launch"**

9. **Review Instance Launch**:
   - Review all settings
   - Click **"Launch"**

10. **Select Key Pair**:
    - Select: `grocery-store-key` (the one you created)
    - Check: "I acknowledge that I have access..."
    - Click **"Launch Instances"**

11. **Instance Launching**:
    - Click **"View Instances"**
    - Wait for instance status to be **"Running"** (2-3 minutes)
    - Note the **Public IPv4 address** (e.g., `54.123.45.67`)

---

## 3. Connect to EC2 Instance

### For Linux/Mac:

**Step 1**: Set correct permissions on key file
```bash
chmod 400 ~/.ssh/grocery-store-key.pem
```

**Step 2**: Connect via SSH
```bash
ssh -i ~/.ssh/grocery-store-key.pem ubuntu@YOUR_PUBLIC_IP
```

**Example**:
```bash
ssh -i ~/.ssh/grocery-store-key.pem ubuntu@54.123.45.67
```

**Step 3**: When prompted "Are you sure you want to continue connecting?", type `yes`

**Step 4**: You should now be connected! You'll see:
```
Welcome to Ubuntu 22.04 LTS...
ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

### For Windows (Using PuTTY):

**Step 1**: Download PuTTY from https://www.putty.org/

**Step 2**: Convert .pem to .ppk:
- Download PuTTYgen
- Load your `.pem` file
- Click "Save private key" → Save as `.ppk`

**Step 3**: Open PuTTY:
- Host Name: `ubuntu@YOUR_PUBLIC_IP`
- Connection type: SSH
- Port: 22
- Go to: Connection → SSH → Auth
- Browse and select your `.ppk` file
- Click "Open"

---

## 4. Initial Server Setup

Once connected to your EC2 instance, run these commands:

### Step 1: Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Basic Tools
```bash
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release
```

### Step 3: Set Timezone (Optional)
```bash
sudo timedatectl set-timezone UTC
```

### Step 4: Create Project Directory
```bash
mkdir -p ~/grocery-store
cd ~/grocery-store
```

---

## 5. Install All Required Software

### 5.1 Install Node.js 18.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Expected Output**:
```
v18.x.x
9.x.x
```

### 5.2 Install Docker

```bash
# Remove old Docker versions if any
sudo apt remove docker docker-engine docker.io containerd runc

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify installation
docker --version
docker compose version
```

**Expected Output**:
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

**Important**: Log out and log back in for docker group to take effect:
```bash
exit
# Then reconnect via SSH
```

### 5.3 Install MongoDB (Optional - if not using Docker)

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package index
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version
```

**Note**: If using Docker Compose, MongoDB will be in a container, so skip this step.

### 5.4 Install AWS CLI (Optional - for AWS operations)

```bash
# Download AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Unzip
unzip awscliv2.zip

# Install
sudo ./aws/install

# Verify
aws --version

# Configure (enter your AWS credentials)
aws configure
```

### 5.5 Install kubectl (Optional - for Kubernetes)

```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make executable
chmod +x kubectl

# Move to PATH
sudo mv kubectl /usr/local/bin/

# Verify
kubectl version --client
```

### 5.6 Install Terraform (Optional - for Infrastructure as Code)

```bash
# Download Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip

# Unzip
unzip terraform_1.6.0_linux_amd64.zip

# Move to PATH
sudo mv terraform /usr/local/bin/

# Verify
terraform --version
```

### 5.7 Install Ansible (Optional - for Configuration Management)

```bash
# Add Ansible repository
sudo apt-add-repository --yes --update ppa:ansible/ansible

# Install Ansible
sudo apt install -y ansible

# Verify
ansible --version
```

### 5.8 Install Nginx (For Production - Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## 6. Deploy Application

### Step 1: Upload Project Files

**Option A: Using Git (Recommended)**

```bash
cd ~/grocery-store

# Clone your repository
git clone <your-repository-url> .

# Or if you have the project locally, use SCP from your local machine:
# scp -i ~/.ssh/grocery-store-key.pem -r /path/to/grocery-store/* ubuntu@YOUR_IP:~/grocery-store/
```

**Option B: Using SCP from Local Machine**

On your **local machine** (not EC2), run:

```bash
# From your local project directory
scp -i ~/.ssh/grocery-store-key.pem -r \
    frontend/ \
    backend/ \
    docker-compose.yml \
    mongo-init.js \
    ubuntu@YOUR_EC2_IP:~/grocery-store/
```

**Option C: Manual Upload via AWS Console**

1. Zip your project files
2. Upload to S3 bucket
3. Download on EC2:
```bash
aws s3 cp s3://your-bucket/grocery-store.zip ~/grocery-store.zip
unzip ~/grocery-store.zip -d ~/grocery-store/
```

### Step 2: Navigate to Project Directory

```bash
cd ~/grocery-store
ls -la
# Should see: frontend/, backend/, docker-compose.yml, etc.
```

### Step 3: Configure Backend Environment

```bash
cd ~/grocery-store/backend

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocery-store
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Verify
cat .env
```

### Step 4: Configure Frontend API URL

```bash
cd ~/grocery-store/frontend/js

# Update API_BASE_URL
sed -i "s|const API_BASE_URL = '.*'|const API_BASE_URL = 'http://YOUR_EC2_IP:3000/api'|g" api.js

# Replace YOUR_EC2_IP with your actual EC2 public IP
# Or use domain name if you have one
```

**Get your EC2 IP**:
```bash
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

**Manual Edit** (if sed doesn't work):
```bash
nano ~/grocery-store/frontend/js/api.js
# Change line 2 to:
# const API_BASE_URL = 'http://YOUR_EC2_IP:3000/api';
# Save: Ctrl+X, then Y, then Enter
```

### Step 5: Install Backend Dependencies

```bash
cd ~/grocery-store/backend
npm install
```

### Step 6: Start Application with Docker Compose

```bash
cd ~/grocery-store

# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

**Expected Output**:
```
NAME                  STATUS          PORTS
grocery-backend       Up              0.0.0.0:3000->3000/tcp
grocery-frontend      Up              0.0.0.0:80->80/tcp
grocery-mongo         Up              27017/tcp
grocery-mongo-express Up             0.0.0.0:8081->8081/tcp
```

### Step 7: Verify Services are Running

```bash
# Check Docker containers
docker ps

# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost/health

# Check MongoDB connection
docker exec grocery-mongo mongosh --eval "db.adminCommand('ping')"
```

---

## 7. Configure Security Groups

### Step 1: Verify Security Group Rules

1. Go to AWS Console → EC2 → Security Groups
2. Select `grocery-store-sg`
3. Verify these inbound rules exist:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS (if using) |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Backend API |
| Custom TCP | TCP | 8081 | 0.0.0.0/0 | Mongo Express |

### Step 2: Add Missing Rules (if needed)

1. Click **"Edit inbound rules"**
2. Click **"Add rule"** for each missing rule
3. Click **"Save rules"**

---

## 8. Access Application

### Step 1: Get Your EC2 Public IP

```bash
# On EC2 instance
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

Or check in AWS Console → EC2 → Instances

### Step 2: Access Services

**Frontend**:
```
http://YOUR_EC2_IP
```

**Backend API**:
```
http://YOUR_EC2_IP:3000/api
```

**Backend Health Check**:
```
http://YOUR_EC2_IP:3000/health
```

**Mongo Express** (Database Admin):
```
http://YOUR_EC2_IP:8081
Username: admin
Password: admin123
```

### Step 3: Test Application

1. Open browser: `http://YOUR_EC2_IP`
2. You should see the Grocery Store homepage
3. Try:
   - Click "Sign Up" → Create account
   - Login with your account
   - Browse products
   - Add items to cart
   - Admin login: `admin@grocerystore.com` / `admin123`

---

## 9. Production Setup

### 9.1 Setup Domain Name (Optional)

**Step 1**: Purchase domain from Route 53 or other registrar

**Step 2**: Create A Record:
- Name: `@` or `www`
- Type: `A`
- Value: Your EC2 Public IP
- TTL: `300`

**Step 3**: Update Frontend API URL:
```bash
cd ~/grocery-store/frontend/js
nano api.js
# Change to: const API_BASE_URL = 'https://yourdomain.com/api';
```

### 9.2 Setup SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS
```

### 9.3 Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/grocery-store
```

**Add this configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/grocery-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9.4 Setup Auto-Start on Boot

```bash
# Create systemd service for Docker Compose
sudo nano /etc/systemd/system/grocery-store.service
```

**Add this content**:
```ini
[Unit]
Description=Grocery Store Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/grocery-store
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
```

**Enable and start**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable grocery-store.service
sudo systemctl start grocery-store.service
```

### 9.5 Setup Automatic Backups

```bash
# Create backup script
nano ~/backup-mongodb.sh
```

**Add this content**:
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec grocery-mongo mongodump --out /tmp/backup
docker cp grocery-mongo:/tmp/backup $BACKUP_DIR/mongodb_$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

**Make executable**:
```bash
chmod +x ~/backup-mongodb.sh
```

**Add to crontab** (daily backup at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/backup-mongodb.sh
```

### 9.6 Setup Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Check system resources
htop

# Monitor Docker containers
docker stats
```

### 9.7 Setup Log Rotation

```bash
# Configure Docker log rotation
sudo nano /etc/docker/daemon.json
```

**Add this content**:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

**Restart Docker**:
```bash
sudo systemctl restart docker
```

---

## 10. Troubleshooting

### Issue: Cannot Connect via SSH

**Solution**:
```bash
# Check security group allows SSH from your IP
# Verify key file permissions
chmod 400 ~/.ssh/grocery-store-key.pem

# Check instance is running
# Verify public IP is correct
```

### Issue: Docker Permission Denied

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker ubuntu

# Log out and log back in
exit
# Reconnect via SSH
```

### Issue: Port Already in Use

**Solution**:
```bash
# Check what's using the port
sudo lsof -i :3000

# Stop conflicting service or change port in docker-compose.yml
```

### Issue: Cannot Access Application

**Solution**:
```bash
# Check containers are running
docker ps

# Check logs
docker compose logs

# Check security group rules
# Verify ports are open in AWS Console

# Test locally on server
curl http://localhost:3000/health
```

### Issue: MongoDB Connection Error

**Solution**:
```bash
# Check MongoDB container
docker ps | grep mongo

# Check MongoDB logs
docker logs grocery-mongo

# Restart MongoDB
docker restart grocery-mongo

# Verify connection
docker exec grocery-mongo mongosh --eval "db.adminCommand('ping')"
```

### Issue: Out of Memory

**Solution**:
```bash
# Check memory usage
free -h

# Upgrade instance type in AWS Console
# Stop unnecessary services
docker system prune -a
```

### Issue: Application Not Starting After Reboot

**Solution**:
```bash
# Check if auto-start service is enabled
sudo systemctl status grocery-store.service

# Enable if not
sudo systemctl enable grocery-store.service
sudo systemctl start grocery-store.service
```

---

## 📋 Quick Command Reference

### Daily Operations

```bash
# Check application status
docker compose ps

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop services
docker compose down

# Start services
docker compose up -d

# Update application
cd ~/grocery-store
git pull
docker compose up -d --build
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# Check Docker resources
docker stats

# Check system logs
sudo journalctl -u grocery-store.service
```

### Backup and Restore

```bash
# Backup MongoDB
docker exec grocery-mongo mongodump --out /tmp/backup
docker cp grocery-mongo:/tmp/backup ~/backup_$(date +%Y%m%d)

# Restore MongoDB
docker cp ~/backup_YYYYMMDD grocery-mongo:/tmp/restore
docker exec grocery-mongo mongorestore /tmp/restore
```

---

## ✅ Deployment Checklist

- [ ] EC2 instance launched and running
- [ ] Security group configured with all ports
- [ ] SSH connection successful
- [ ] All software installed (Node.js, Docker, etc.)
- [ ] Project files uploaded to EC2
- [ ] Backend .env file configured
- [ ] Frontend API URL updated
- [ ] Docker Compose services running
- [ ] Frontend accessible via browser
- [ ] Backend API responding
- [ ] Can create user account
- [ ] Can login
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Admin dashboard accessible
- [ ] Auto-start service configured
- [ ] Backups configured
- [ ] Monitoring setup

---

## 🎯 Summary

You now have:
- ✅ Complete Grocery Store application running on EC2
- ✅ All services containerized with Docker
- ✅ Production-ready setup with auto-start
- ✅ Backup system configured
- ✅ Monitoring tools installed

**Access your application at**: `http://YOUR_EC2_IP`

**Next Steps**:
1. Setup domain name and SSL certificate
2. Configure custom monitoring
3. Setup CI/CD pipeline
4. Scale to multiple instances (if needed)

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Last Updated**: 2024
**Version**: 1.0

