# 🚀 Complete Requirements & Setup Guide

This document lists everything you need to fully process and deploy the Grocery E-Commerce project from start to finish.

## 📋 Table of Contents

1. [System Requirements](#1-system-requirements)
2. [Software Prerequisites](#2-software-prerequisites)
3. [AWS Account Setup](#3-aws-account-setup)
4. [Local Development Setup](#4-local-development-setup)
5. [Docker Setup](#5-docker-setup)
6. [Kubernetes Setup](#6-kubernetes-setup)
7. [CI/CD Setup](#7-cicd-setup)
8. [Complete Deployment Workflow](#8-complete-deployment-workflow)
9. [Verification Checklist](#9-verification-checklist)

---

## 1. System Requirements

### Minimum Hardware Requirements

**For Local Development:**
- **CPU**: 2 cores minimum, 4 cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB free space minimum
- **OS**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

**For AWS Deployment:**
- **EC2 Instance**: t3.medium or larger (2 vCPU, 4GB RAM minimum)
- **EKS Node Group**: t3.medium instances (2-4 nodes)
- **Storage**: 50GB+ for databases and logs

### Network Requirements

- **Internet Connection**: Stable connection for downloads and deployments
- **Ports to Open**:
  - 22 (SSH)
  - 80 (HTTP)
  - 443 (HTTPS)
  - 3000 (Backend API)
  - 8080 (Jenkins)
  - 8081 (Mongo Express)
  - 9090 (Prometheus)
  - 27017 (MongoDB - internal only)

---

## 2. Software Prerequisites

### Required Software (Install in Order)

#### 2.1 Git
**Purpose**: Version control and code management

**Installation:**

**Windows:**
```bash
# Download from: https://git-scm.com/download/win
# Or use Chocolatey:
choco install git
```

**macOS:**
```bash
# Using Homebrew:
brew install git

# Or download from: https://git-scm.com/download/mac
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git -y
```

**Verify Installation:**
```bash
git --version
# Should show: git version 2.x.x or higher
```

---

#### 2.2 Node.js and npm
**Purpose**: Backend runtime and package management

**Installation:**

**Windows:**
```bash
# Download from: https://nodejs.org/
# Install Node.js 18.x LTS version
# Or use Chocolatey:
choco install nodejs-lts
```

**macOS:**
```bash
# Using Homebrew:
brew install node@18

# Or download from: https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Verify Installation:**
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
```

---

#### 2.3 Docker Desktop
**Purpose**: Containerization and local development

**Installation:**

**Windows:**
```bash
# Download from: https://www.docker.com/products/docker-desktop
# Install Docker Desktop for Windows
# Enable WSL 2 backend if available
```

**macOS:**
```bash
# Download from: https://www.docker.com/products/docker-desktop
# Install Docker Desktop for Mac
```

**Linux (Ubuntu/Debian):**
```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Verify Installation:**
```bash
docker --version
# Should show: Docker version 24.x.x or higher

docker-compose --version
# Should show: Docker Compose version v2.x.x or higher

# Test Docker
docker run hello-world
```

**Start Docker:**
- Windows/Mac: Open Docker Desktop application
- Linux: `sudo systemctl start docker && sudo systemctl enable docker`

---

#### 2.4 MongoDB (Optional for Local Development)
**Purpose**: Database (if not using Docker)

**Installation:**

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install MongoDB Community Server
```

**macOS:**
```bash
# Using Homebrew:
brew tap mongodb/brew
brew install mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify Installation:**
```bash
mongod --version
# Should show: db version v7.0.x
```

**Note**: If using Docker Compose, MongoDB will be automatically installed in a container.

---

#### 2.5 AWS CLI
**Purpose**: AWS resource management

**Installation:**

**Windows:**
```bash
# Download MSI installer from:
# https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use Chocolatey:
choco install awscli
```

**macOS:**
```bash
# Download from: https://awscli.amazonaws.com/AWSCLIV2.pkg
# Or use Homebrew:
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify Installation:**
```bash
aws --version
# Should show: aws-cli/2.x.x

# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

**Get AWS Credentials:**
1. Go to AWS Console → IAM → Users
2. Create new user or select existing
3. Attach policies: `AdministratorAccess` (for full deployment)
4. Create Access Key
5. Download and save credentials securely

---

#### 2.6 kubectl
**Purpose**: Kubernetes cluster management

**Installation:**

**Windows:**
```bash
# Download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
# Or use Chocolatey:
choco install kubernetes-cli
```

**macOS:**
```bash
# Using Homebrew:
brew install kubectl

# Or download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/
```

**Linux:**
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**Verify Installation:**
```bash
kubectl version --client
# Should show: Client Version: v1.28.x or higher
```

---

#### 2.7 Terraform
**Purpose**: Infrastructure as Code

**Installation:**

**Windows:**
```bash
# Download from: https://www.terraform.io/downloads
# Or use Chocolatey:
choco install terraform
```

**macOS:**
```bash
# Using Homebrew:
brew install terraform
```

**Linux:**
```bash
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

**Verify Installation:**
```bash
terraform --version
# Should show: Terraform v1.6.x or higher
```

---

#### 2.8 Ansible
**Purpose**: Configuration management

**Installation:**

**Windows:**
```bash
# Install WSL2 first, then:
wsl
# Then follow Linux instructions
# Or use pip:
pip install ansible
```

**macOS:**
```bash
# Using Homebrew:
brew install ansible

# Or use pip:
pip3 install ansible
```

**Linux:**
```bash
sudo apt update
sudo apt install software-properties-common -y
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt install ansible -y
```

**Verify Installation:**
```bash
ansible --version
# Should show: ansible [core 2.15.x] or higher
```

---

#### 2.9 Jenkins (For CI/CD)
**Purpose**: Continuous Integration and Deployment

**Installation Options:**

**Option 1: Docker (Recommended)**
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

**Option 2: On Server (Linux)**
```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

**Access Jenkins:**
- URL: `http://localhost:8080` or `http://your-server-ip:8080`
- Get initial password: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`

**Required Jenkins Plugins:**
1. Docker Pipeline
2. Kubernetes CLI
3. Git
4. AWS Credentials
5. Pipeline

---

## 3. AWS Account Setup

### 3.1 Create AWS Account
1. Go to https://aws.amazon.com/
2. Sign up for free tier account
3. Add payment method (required, but free tier won't charge)

### 3.2 Configure IAM User
1. Go to IAM → Users → Create User
2. Name: `grocery-store-admin`
3. Attach policy: `AdministratorAccess` (or create custom policy)
4. Create Access Key
5. Download credentials

### 3.3 Configure AWS CLI
```bash
aws configure
# Enter:
# AWS Access Key ID: [your-key]
# AWS Secret Access Key: [your-secret]
# Default region: us-east-1
# Default output format: json
```

### 3.4 Verify AWS Access
```bash
aws sts get-caller-identity
# Should show your account ID and user ARN
```

### 3.5 Create SSH Key Pair
```bash
# Create key pair in AWS Console:
# EC2 → Key Pairs → Create Key Pair
# Name: grocery-store-key
# Type: RSA
# Format: .pem
# Download and save securely

# Set permissions (Linux/Mac):
chmod 400 ~/.ssh/grocery-store-key.pem
```

---

## 4. Local Development Setup

### Step 1: Clone/Download Project
```bash
# If using Git:
git clone <repository-url>
cd grocery-store

# Or extract downloaded ZIP file
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Create Backend Environment File
```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env
# Or use any text editor

# Add these lines:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/grocery-store
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Step 4: Start MongoDB (if not using Docker)
```bash
# Linux/Mac:
sudo systemctl start mongod

# Windows:
# Start MongoDB service from Services panel

# Verify:
mongosh
# Should connect to MongoDB
```

### Step 5: Start Backend Server
```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
# Server should start on http://localhost:3000
```

### Step 6: Configure Frontend
```bash
cd frontend/js
nano api.js

# Update API_BASE_URL:
const API_BASE_URL = 'http://localhost:3000/api';
```

### Step 7: Open Frontend
```bash
# Option 1: Open directly in browser
# Navigate to: frontend/index.html

# Option 2: Use local server
cd frontend
python -m http.server 8000
# Or: npx http-server
# Access at: http://localhost:8000
```

---

## 5. Docker Setup

### Step 1: Verify Docker is Running
```bash
docker ps
# Should show empty list or running containers
```

### Step 2: Build and Start with Docker Compose
```bash
# From project root:
docker-compose up -d --build

# This will:
# - Build frontend image
# - Build backend image
# - Pull MongoDB image
# - Pull Mongo Express image
# - Start all services
```

### Step 3: Verify Services
```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs -f

# Should see:
# - grocery-frontend (port 80)
# - grocery-backend (port 3000)
# - grocery-mongo (port 27017)
# - grocery-mongo-express (port 8081)
```

### Step 4: Access Services
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health
- Mongo Express: http://localhost:8081 (admin/admin123)

### Step 5: Stop Services (when done)
```bash
docker-compose down

# To remove volumes (delete data):
docker-compose down -v
```

---

## 6. Kubernetes Setup

### Step 1: Deploy Infrastructure with Terraform
```bash
cd terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars
# Update: aws_region, ec2_key_name, etc.

# Plan deployment
terraform plan

# Apply infrastructure (takes 15-20 minutes)
terraform apply
# Type: yes when prompted

# Save outputs
terraform output -json > outputs.json
```

### Step 2: Configure kubectl for EKS
```bash
# Get cluster name from Terraform output
CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
REGION=$(terraform output -raw aws_region)

# Configure kubectl
aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION

# Verify connection
kubectl get nodes
# Should show worker nodes
```

### Step 3: Build and Push Docker Images
```bash
# Login to Docker registry (Docker Hub example)
docker login

# Build backend image
cd backend
docker build -t your-username/grocery-store-backend:latest .
docker push your-username/grocery-store-backend:latest

# Build frontend image
cd ../frontend
docker build -t your-username/grocery-store-frontend:latest .
docker push your-username/grocery-store-frontend:latest
```

### Step 4: Update Kubernetes Manifests
```bash
cd k8s

# Update image URLs in:
# - backend-deployment.yaml
# - frontend-deployment.yaml

# Replace: grocery-store-backend:latest
# With: your-username/grocery-store-backend:latest
```

### Step 5: Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f namespace.yaml

# Deploy MongoDB
kubectl apply -f mongo-deployment.yaml

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongo -n grocery-store --timeout=300s

# Deploy Backend
kubectl apply -f backend-deployment.yaml

# Deploy Frontend
kubectl apply -f frontend-deployment.yaml

# Deploy Mongo Express (optional)
kubectl apply -f mongo-express-deployment.yaml

# Deploy Ingress (if configured)
kubectl apply -f ingress.yaml
```

### Step 6: Verify Deployment
```bash
# Check pods
kubectl get pods -n grocery-store

# Check services
kubectl get svc -n grocery-store

# Check deployments
kubectl get deployments -n grocery-store

# View logs
kubectl logs -f deployment/backend-deployment -n grocery-store
```

### Step 7: Access Services
```bash
# Get service URLs
kubectl get svc -n grocery-store

# Port forward to access locally
kubectl port-forward -n grocery-store svc/frontend-service 8080:80
# Access at: http://localhost:8080

kubectl port-forward -n grocery-store svc/backend-service 3000:3000
# Access at: http://localhost:3000
```

---

## 7. CI/CD Setup

### Step 1: Install Jenkins
```bash
# Using Docker (recommended):
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Get initial password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 2: Configure Jenkins
1. Access: http://localhost:8080
2. Enter initial password
3. Install suggested plugins
4. Create admin user
5. Install additional plugins:
   - Docker Pipeline
   - Kubernetes CLI
   - Git
   - AWS Credentials

### Step 3: Configure Credentials in Jenkins
1. Go to: Manage Jenkins → Credentials
2. Add credentials:
   - **Docker Registry**: Username/Password for Docker Hub/ECR
   - **AWS Credentials**: AWS Access Key and Secret
   - **SSH Key**: For server access

### Step 4: Create Jenkins Pipeline
1. New Item → Pipeline
2. Name: `grocery-store-pipeline`
3. Pipeline → Definition: Pipeline script from SCM
4. SCM: Git
5. Repository URL: Your Git repository URL
6. Branch: `main` or `master`
7. Script Path: `Jenkinsfile`

### Step 5: Update Jenkinsfile
```bash
# Edit Jenkinsfile in project root
nano Jenkinsfile

# Update these variables:
# - DOCKER_REGISTRY
# - DOCKER_IMAGE_PREFIX
# - AWS_REGION
# - AWS_EKS_CLUSTER
```

### Step 6: Run Pipeline
1. Click "Build Now" in Jenkins
2. Monitor build progress
3. Check console output for errors

---

## 8. Complete Deployment Workflow

### Phase 1: Local Development
```bash
# 1. Install all prerequisites
# 2. Clone project
git clone <repo>
cd grocery-store

# 3. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env file
npm start

# 4. Setup frontend
cd ../frontend
# Update api.js with localhost URL
# Open index.html in browser
```

### Phase 2: Docker Local Testing
```bash
# 1. Build and run
docker-compose up -d --build

# 2. Test all services
curl http://localhost:3000/health
curl http://localhost/health

# 3. Access frontend
# Open: http://localhost
```

### Phase 3: AWS Infrastructure
```bash
# 1. Configure AWS CLI
aws configure

# 2. Deploy infrastructure
cd terraform
terraform init
terraform plan
terraform apply

# 3. Wait for completion (15-20 minutes)
# 4. Save outputs
terraform output -json > outputs.json
```

### Phase 4: Build and Push Images
```bash
# 1. Login to registry
docker login

# 2. Build images
docker build -t your-registry/backend:latest ./backend
docker build -t your-registry/frontend:latest ./frontend

# 3. Push images
docker push your-registry/backend:latest
docker push your-registry/frontend:latest
```

### Phase 5: Kubernetes Deployment
```bash
# 1. Configure kubectl
aws eks update-kubeconfig --name <cluster-name> --region <region>

# 2. Update K8s manifests with image URLs
# 3. Deploy
kubectl apply -f k8s/

# 4. Verify
kubectl get all -n grocery-store
```

### Phase 6: Monitoring Setup
```bash
# 1. Deploy Prometheus
kubectl apply -f monitoring/prometheus-deployment.yaml

# 2. Deploy Grafana
kubectl apply -f monitoring/grafana-deployment.yaml

# 3. Access
kubectl port-forward -n monitoring svc/prometheus-service 9090:9090
kubectl port-forward -n monitoring svc/grafana-service 3000:3000
```

### Phase 7: CI/CD Setup
```bash
# 1. Install Jenkins
# 2. Configure credentials
# 3. Create pipeline
# 4. Run first build
```

---

## 9. Verification Checklist

### ✅ Prerequisites Installed
- [ ] Git installed and configured
- [ ] Node.js 18+ and npm installed
- [ ] Docker Desktop installed and running
- [ ] AWS CLI installed and configured
- [ ] kubectl installed
- [ ] Terraform installed
- [ ] Ansible installed
- [ ] Jenkins installed (optional)

### ✅ AWS Setup Complete
- [ ] AWS account created
- [ ] IAM user created with access keys
- [ ] AWS CLI configured
- [ ] SSH key pair created
- [ ] AWS credentials verified

### ✅ Local Development Working
- [ ] Backend starts successfully
- [ ] Frontend opens in browser
- [ ] API endpoints respond
- [ ] MongoDB connection works
- [ ] Can login/signup
- [ ] Can add products to cart

### ✅ Docker Setup Working
- [ ] All containers start
- [ ] Frontend accessible on port 80
- [ ] Backend accessible on port 3000
- [ ] Mongo Express accessible on port 8081
- [ ] No container errors in logs

### ✅ Infrastructure Deployed
- [ ] Terraform apply successful
- [ ] VPC created
- [ ] EC2 instances running
- [ ] EKS cluster created
- [ ] kubectl connected to cluster

### ✅ Kubernetes Deployment Working
- [ ] All pods running
- [ ] Services created
- [ ] Can access frontend via port-forward
- [ ] Can access backend via port-forward
- [ ] MongoDB persistent volume created

### ✅ CI/CD Pipeline Working
- [ ] Jenkins accessible
- [ ] Pipeline created
- [ ] Build succeeds
- [ ] Images pushed to registry
- [ ] Deployment to K8s works

### ✅ Monitoring Working
- [ ] Prometheus accessible
- [ ] Grafana accessible
- [ ] Dashboards configured
- [ ] Metrics being collected

---

## 🔧 Quick Troubleshooting Commands

```bash
# Check Docker
docker ps
docker-compose logs

# Check Kubernetes
kubectl get pods -A
kubectl describe pod <pod-name> -n grocery-store
kubectl logs <pod-name> -n grocery-store

# Check AWS
aws sts get-caller-identity
aws eks list-clusters

# Check Terraform
terraform validate
terraform plan
terraform show

# Check Ansible
ansible all -m ping
ansible-playbook --syntax-check playbooks/install-docker.yml
```

---

## 📚 Additional Resources

- **Docker Documentation**: https://docs.docker.com/
- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **Terraform AWS Provider**: https://registry.terraform.io/providers/hashicorp/aws/
- **Ansible Documentation**: https://docs.ansible.com/
- **Jenkins Documentation**: https://www.jenkins.io/doc/
- **AWS EKS Guide**: https://docs.aws.amazon.com/eks/

---

## ⚠️ Important Notes

1. **Costs**: AWS resources will incur costs. Use free tier when possible, monitor usage.
2. **Security**: Change all default passwords and secrets before production.
3. **Backups**: Set up regular backups for MongoDB data.
4. **Monitoring**: Set up alerts for resource usage and errors.
5. **Updates**: Keep all software updated to latest stable versions.

---

**Last Updated**: 2024
**Version**: 1.0

