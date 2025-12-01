# Grocery E-Commerce Website - Complete DevOps Project

A full-stack grocery e-commerce application with complete DevOps pipeline including Docker, Kubernetes, Jenkins CI/CD, Terraform, Ansible, and Prometheus/Grafana monitoring.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This project is a complete grocery e-commerce platform with:

- **Frontend**: HTML, CSS, JavaScript (responsive design similar to Zepto/Blinkit)
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (EKS)
- **CI/CD**: Jenkins Pipeline
- **Infrastructure**: Terraform (AWS EC2, EKS, VPC)
- **Configuration Management**: Ansible
- **Monitoring**: Prometheus + Grafana

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   MongoDB   │
│  (Nginx)    │     │  (Express)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
              ┌────────────┴────────────┐
              │   Kubernetes (EKS)      │
              └────────────┬────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
  ┌─────────────┐                      ┌─────────────┐
  │ Prometheus  │                      │   Grafana   │
  │             │◀─────────────────────│             │
  └─────────────┘                      └─────────────┘
```

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- Nginx

### Backend
- Node.js 18+
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

### DevOps
- Docker & Docker Compose
- Kubernetes (EKS)
- Jenkins
- Terraform
- Ansible
- Prometheus
- Grafana

## 📁 Project Structure

```
grocery-store/
├── frontend/                  # Frontend application
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── products.html
│   ├── cart.html
│   ├── checkout.html
│   ├── profile.html
│   ├── admin-dashboard.html
│   ├── admin-login.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                   # Backend API
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Docker Compose configuration
├── mongo-init.js             # MongoDB initialization script
│
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── mongo-deployment.yaml
│   ├── mongo-express-deployment.yaml
│   └── ingress.yaml
│
├── terraform/                # Terraform infrastructure
│   ├── main.tf
│   ├── ec2.tf
│   ├── eks.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
│
├── ansible/                  # Ansible playbooks
│   ├── playbooks/
│   │   ├── install-docker.yml
│   │   ├── install-jenkins.yml
│   │   ├── deploy-docker-compose.yml
│   │   ├── configure-kubernetes.yml
│   │   └── copy-application-files.yml
│   ├── inventory/
│   │   └── hosts.ini
│   └── ansible.cfg
│
├── monitoring/               # Monitoring configuration
│   ├── prometheus-deployment.yaml
│   ├── grafana-deployment.yaml
│   ├── service-monitor.yaml
│   └── README.md
│
├── Jenkinsfile               # Jenkins CI/CD pipeline
└── README.md                 # This file
```

## 📋 Prerequisites

**📖 For complete requirements and detailed setup instructions, see [REQUIREMENTS_AND_SETUP.md](./REQUIREMENTS_AND_SETUP.md)**

### Quick Prerequisites List

**Local Development:**
- Node.js 18+ and npm
- MongoDB 7.0+ (or use Docker)
- Docker & Docker Compose
- Git

**AWS Deployment:**
- AWS Account with IAM user
- AWS CLI configured with credentials
- kubectl (Kubernetes CLI)
- Terraform 1.0+
- Ansible 2.9+
- SSH key pair in AWS

**CI/CD:**
- Jenkins (optional, can use Docker)
- Docker registry account (Docker Hub/AWS ECR)

**See [REQUIREMENTS_AND_SETUP.md](./REQUIREMENTS_AND_SETUP.md) for:**
- Detailed installation steps for each tool
- System requirements
- AWS account setup
- Complete deployment workflow
- Verification checklist

## 🚀 Quick Start

### Option 1: Deploy on EC2 Ubuntu (Recommended for Production)

**📖 Complete step-by-step guide: [EC2_UBUNTU_DEPLOYMENT_GUIDE.md](./EC2_UBUNTU_DEPLOYMENT_GUIDE.md)**

This guide covers:
- Launching EC2 Ubuntu instance
- Installing all prerequisites
- Deploying entire application
- Production setup with SSL
- Auto-start and backups

**Quick Commands**:
```bash
# On EC2 Ubuntu instance:
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git nodejs npm
cd ~ && git clone <repo> grocery-store
cd grocery-store && docker compose up -d --build
```

### 2. Local Development with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd grocery-store

# Start all services
docker-compose up -d --build

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

**Access Points:**
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (admin/admin123)

### 2. Local Development without Docker

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm start
```

#### Frontend Setup

```bash
cd frontend
# Open index.html in browser or use a local server
python -m http.server 8000
# Access at http://localhost:8000
```

## 📚 Detailed Setup Instructions

### MongoDB Schema

#### Collections

1. **users**
   - `_id`: ObjectId
   - `name`: String
   - `email`: String (unique)
   - `password`: String (hashed)
   - `address`: String
   - `createdAt`: Date

2. **admins**
   - `_id`: ObjectId
   - `name`: String
   - `email`: String (unique)
   - `password`: String (hashed)
   - `createdAt`: Date

3. **products**
   - `_id`: ObjectId
   - `name`: String
   - `category`: String (enum: fruits, vegetables, dairy, snacks, beverages, meat)
   - `price`: Number
   - `stock`: Number
   - `description`: String
   - `image`: String
   - `createdAt`: Date

4. **carts**
   - `_id`: ObjectId
   - `user`: ObjectId (ref: User)
   - `items`: Array
     - `product`: ObjectId (ref: Product)
     - `quantity`: Number
   - `updatedAt`: Date

5. **orders**
   - `_id`: ObjectId
   - `user`: ObjectId (ref: User)
   - `orderNumber`: String (unique)
   - `items`: Array
     - `product`: ObjectId (ref: Product)
     - `quantity`: Number
     - `price`: Number
   - `totalAmount`: Number
   - `shippingAddress`: String
   - `phone`: String
   - `paymentMethod`: String
   - `status`: String (enum: pending, processing, shipped, delivered, cancelled)
   - `createdAt`: Date

### Default Credentials

**Admin Login:**
- Email: `admin@grocerystore.com`
- Password: `admin123`

**Note**: Change default passwords in production!

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### User Signup
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main St"
}
```

#### User Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@grocerystore.com",
  "password": "admin123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?category=fruits&search=apple&limit=10
Authorization: Bearer <token>
```

#### Get Single Product
```http
GET /products/:id
Authorization: Bearer <token>
```

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 2
}
```

#### Remove from Cart
```http
POST /cart/remove
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id"
}
```

### Order Endpoints

#### Create Order
```http
POST /order/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": "123 Main St",
  "phone": "1234567890",
  "paymentMethod": "cod"
}
```

#### Get Order History
```http
GET /order/history
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Products (Admin)
```http
GET /admin/products
Authorization: Bearer <admin_token>
```

#### Add Product (Admin)
```http
POST /admin/products/add
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Fresh Apples",
  "category": "fruits",
  "price": 150,
  "stock": 100,
  "description": "Fresh red apples",
  "image": "https://example.com/image.jpg"
}
```

#### Update Product (Admin)
```http
PUT /admin/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 200,
  "stock": 150
}
```

#### Delete Product (Admin)
```http
DELETE /admin/products/:id
Authorization: Bearer <admin_token>
```

## 🚢 Deployment

### 1. AWS Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars from example
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply

# Save outputs
terraform output -json > outputs.json
```

### 2. Configure Kubernetes for EKS

```bash
# Get EKS cluster name from Terraform output
CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
REGION=$(terraform output -raw aws_region)

# Configure kubectl
aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION

# Verify connection
kubectl get nodes
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongo-deployment.yaml

# Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Deploy Mongo Express (optional)
kubectl apply -f k8s/mongo-express-deployment.yaml

# Deploy Ingress (if using ingress controller)
kubectl apply -f k8s/ingress.yaml
```

### 4. Build and Push Docker Images

```bash
# Build backend image
cd backend
docker build -t your-registry/grocery-store-backend:latest .
docker push your-registry/grocery-store-backend:latest

# Build frontend image
cd ../frontend
docker build -t your-registry/grocery-store-frontend:latest .
docker push your-registry/grocery-store-frontend:latest
```

### 5. Deploy with Ansible

```bash
cd ansible

# Update inventory with your server IPs
nano inventory/hosts.ini

# Install Docker on servers
ansible-playbook playbooks/install-docker.yml

# Install Jenkins (optional)
ansible-playbook playbooks/install-jenkins.yml

# Copy application files
ansible-playbook playbooks/copy-application-files.yml

# Deploy with Docker Compose
ansible-playbook playbooks/deploy-docker-compose.yml

# Configure Kubernetes (if applicable)
ansible-playbook playbooks/configure-kubernetes.yml \
  -e eks_cluster_name=your-cluster-name \
  -e aws_region=us-east-1
```

### 6. Jenkins CI/CD Setup

1. **Install Jenkins Plugins:**
   - Docker Pipeline
   - Kubernetes CLI
   - AWS Credentials

2. **Configure Credentials:**
   - Docker Registry credentials
   - AWS credentials
   - Kubernetes kubeconfig

3. **Create Pipeline:**
   - Create new Pipeline job
   - Select "Pipeline script from SCM"
   - Point to repository with Jenkinsfile

4. **Run Pipeline:**
   ```bash
   # Pipeline will automatically:
   # 1. Pull latest code
   # 2. Install dependencies
   # 3. Build Docker images
   # 4. Push to registry
   # 5. Deploy to Kubernetes
   ```

## 📊 Monitoring

### Deploy Prometheus and Grafana

```bash
# Deploy Prometheus
kubectl apply -f monitoring/prometheus-deployment.yaml

# Deploy Grafana
kubectl apply -f monitoring/grafana-deployment.yaml

# Deploy ServiceMonitor (if using Prometheus Operator)
kubectl apply -f monitoring/service-monitor.yaml

# Access Prometheus
kubectl port-forward -n monitoring svc/prometheus-service 9090:9090
# Open http://localhost:9090

# Access Grafana
kubectl port-forward -n monitoring svc/grafana-service 3000:3000
# Open http://localhost:3000
# Default credentials: admin/admin123
```

### Grafana Dashboard Setup

1. Login to Grafana
2. Add Prometheus data source:
   - URL: `http://prometheus-service:9090`
   - Access: Server
3. Import dashboards:
   - Kubernetes Cluster Monitoring (ID: 7249)
   - Node Exporter Full (ID: 1860)

## ⚙️ Customization Guide

For detailed step-by-step instructions on customizing configuration files, see **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)**.

This guide covers:
- Line-by-line instructions for each configuration file
- How to update environment variables
- How to configure AWS resources
- How to set up Docker registries
- How to configure Ansible inventory
- Security best practices

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check MongoDB is running
docker ps | grep mongo

# Check connection string
# In backend/.env: MONGODB_URI=mongodb://mongo:27017/grocery-store
```

#### 2. Frontend API Connection Error
```bash
# Update API_BASE_URL in frontend/js/api.js
# For Docker: http://backend-service:3000/api
# For local: http://localhost:3000/api
```

#### 3. Kubernetes Deployment Failing
```bash
# Check pod status
kubectl get pods -n grocery-store

# Check pod logs
kubectl logs -n grocery-store <pod-name>

# Check service status
kubectl get svc -n grocery-store
```

#### 4. Terraform Errors
```bash
# Validate Terraform files
terraform validate

# Check AWS credentials
aws sts get-caller-identity

# Review Terraform state
terraform show
```

#### 5. Jenkins Pipeline Failures
```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Verify Docker access
docker ps

# Check kubectl configuration
kubectl config view
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocery-store
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

### Frontend
Update `API_BASE_URL` in `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🎯 End-to-End Commands

### Complete Local Setup
```bash
# 1. Start all services
docker-compose up -d --build

# 2. Verify services
docker-compose ps

# 3. Check logs
docker-compose logs -f

# 4. Access application
# Frontend: http://localhost
# Backend: http://localhost:3000/api
```

### Complete AWS Deployment
```bash
# 1. Provision infrastructure
cd terraform
terraform init
terraform apply

# 2. Configure kubectl
aws eks update-kubeconfig --name grocery-store-cluster --region us-east-1

# 3. Build and push images
docker build -t your-registry/grocery-store-backend:latest ./backend
docker build -t your-registry/grocery-store-frontend:latest ./frontend
docker push your-registry/grocery-store-backend:latest
docker push your-registry/grocery-store-frontend:latest

# 4. Deploy to Kubernetes
kubectl apply -f k8s/

# 5. Deploy monitoring
kubectl apply -f monitoring/

# 6. Verify deployment
kubectl get all -n grocery-store
```

## 📖 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Created as a complete DevOps project demonstration.

---

**Note**: This is a comprehensive project for learning purposes. In production, ensure:
- Secure JWT secrets
- Strong passwords
- HTTPS/TLS encryption
- Database backups
- Monitoring and alerting
- Security scanning
- Proper access controls

# myproject
