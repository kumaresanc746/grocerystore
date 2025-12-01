# Grocery E-Commerce - Complete Project Structure

## 📂 Directory Structure Overview

```
grocery-store/
│
├── 📁 frontend/                    # Frontend Application (HTML/CSS/JS)
│   ├── index.html                  # Home page
│   ├── login.html                  # User login page
│   ├── signup.html                 # User registration
│   ├── admin-login.html            # Admin login page
│   ├── products.html               # Product listing page
│   ├── product-details.html        # Product details page
│   ├── cart.html                   # Shopping cart page
│   ├── checkout.html               # Checkout page
│   ├── profile.html                # User profile & orders
│   ├── admin-dashboard.html        # Admin CRUD dashboard
│   ├── 📁 css/
│   │   └── styles.css              # Main stylesheet (responsive)
│   ├── 📁 js/
│   │   ├── api.js                  # API utility functions
│   │   ├── auth.js                 # Authentication helpers
│   │   ├── index.js                # Home page logic
│   │   ├── products.js             # Products page logic
│   │   ├── product-details.js      # Product details logic
│   │   ├── cart.js                 # Cart management
│   │   ├── checkout.js             # Checkout process
│   │   ├── profile.js              # Profile management
│   │   └── admin.js                # Admin dashboard logic
│   ├── Dockerfile                  # Frontend Docker image
│   ├── nginx.conf                  # Nginx configuration
│   └── .dockerignore
│
├── 📁 backend/                     # Backend API (Node.js/Express)
│   ├── server.js                   # Express server entry point
│   ├── package.json                # Node.js dependencies
│   ├── 📁 models/                  # MongoDB Mongoose models
│   │   ├── User.js                 # User model
│   │   ├── Admin.js                # Admin model
│   │   ├── Product.js              # Product model
│   │   ├── Cart.js                 # Cart model
│   │   └── Order.js                # Order model
│   ├── 📁 routes/                  # API route handlers
│   │   ├── auth.js                 # Authentication routes
│   │   ├── products.js             # Product routes
│   │   ├── cart.js                 # Cart routes
│   │   ├── orders.js               # Order routes
│   │   ├── user.js                 # User profile routes
│   │   └── admin.js                # Admin routes
│   ├── 📁 middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── Dockerfile                  # Backend Docker image
│   ├── .dockerignore
│   └── .env.example                # Environment variables template
│
├── 📁 k8s/                         # Kubernetes Deployment Manifests
│   ├── namespace.yaml              # Namespace definition
│   ├── backend-deployment.yaml     # Backend deployment & service
│   ├── frontend-deployment.yaml    # Frontend deployment & service
│   ├── mongo-deployment.yaml       # MongoDB deployment & PVC
│   ├── mongo-express-deployment.yaml  # Mongo Express UI
│   └── ingress.yaml                # Ingress configuration
│
├── 📁 terraform/                   # Infrastructure as Code (AWS)
│   ├── main.tf                     # VPC, Subnets, Internet Gateway
│   ├── ec2.tf                      # EC2 instances & security groups
│   ├── eks.tf                      # EKS cluster & node groups
│   ├── variables.tf                # Terraform variables
│   ├── outputs.tf                  # Terraform outputs
│   └── terraform.tfvars.example    # Variables example file
│
├── 📁 ansible/                     # Configuration Management
│   ├── ansible.cfg                 # Ansible configuration
│   ├── 📁 inventory/
│   │   └── hosts.ini               # Inventory file
│   └── 📁 playbooks/
│       ├── install-docker.yml      # Install Docker on servers
│       ├── install-jenkins.yml     # Install Jenkins
│       ├── deploy-docker-compose.yml  # Deploy with Docker Compose
│       ├── configure-kubernetes.yml   # Configure Kubernetes
│       └── copy-application-files.yml # Copy app files to servers
│
├── 📁 monitoring/                  # Monitoring & Observability
│   ├── prometheus-deployment.yaml  # Prometheus deployment
│   ├── grafana-deployment.yaml     # Grafana deployment
│   ├── service-monitor.yaml        # ServiceMonitor for Prometheus
│   └── README.md                   # Monitoring setup guide
│
├── docker-compose.yml              # Docker Compose configuration
├── mongo-init.js                   # MongoDB initialization script
├── Jenkinsfile                     # Jenkins CI/CD pipeline
├── README.md                       # Main project documentation
└── PROJECT_STRUCTURE.md            # This file
```

## 🎯 Components Overview

### Frontend (HTML/CSS/JavaScript)
- **10 HTML Pages**: Home, Login, Signup, Products, Cart, Checkout, Profile, Admin
- **Responsive Design**: Mobile-first approach similar to Zepto/Blinkit
- **8 JavaScript Modules**: API calls, authentication, page-specific logic
- **Single CSS File**: Comprehensive styling with CSS variables

### Backend (Node.js/Express)
- **6 Models**: User, Admin, Product, Cart, Order (MongoDB/Mongoose)
- **6 Route Modules**: Auth, Products, Cart, Orders, User, Admin
- **JWT Authentication**: Secure token-based auth for users and admins
- **RESTful API**: Complete CRUD operations

### Docker & Docker Compose
- **2 Dockerfiles**: Frontend (Nginx) and Backend (Node.js)
- **4 Services**: Frontend, Backend, MongoDB, Mongo Express
- **Network Configuration**: Isolated Docker network
- **Volume Management**: Persistent MongoDB data

### Kubernetes (K8s)
- **6 Deployment Manifests**: All services containerized
- **Services**: ClusterIP and LoadBalancer types
- **Persistent Volumes**: MongoDB and Prometheus data
- **Ingress**: HTTP/HTTPS routing configuration
- **Secrets**: JWT secrets and credentials management

### Terraform (AWS Infrastructure)
- **VPC Setup**: Public and private subnets across AZs
- **EC2 Instances**: For Jenkins and application servers
- **EKS Cluster**: Managed Kubernetes on AWS
- **Auto-scaling**: Node group with min/max configuration
- **Security Groups**: Network access controls
- **IAM Roles**: Proper permissions for services

### Ansible Playbooks
- **5 Playbooks**: Docker, Jenkins, Deployment, K8s, File Copy
- **Multi-OS Support**: Debian/Ubuntu and RedHat/CentOS
- **Idempotent**: Safe to run multiple times
- **Inventory Management**: Flexible server configuration

### Jenkins CI/CD
- **6 Pipeline Stages**:
  1. Git Pull
  2. Install Dependencies
  3. Build Frontend
  4. Docker Build
  5. Docker Push
  6. Deploy to Kubernetes
- **Health Checks**: Post-deployment verification
- **Parallel Execution**: Optimized build times

### Monitoring
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **ServiceMonitor**: Auto-discovery of services
- **Persistent Storage**: Long-term metric retention

## 📊 Technology Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Nginx |
| Backend | Node.js 18, Express.js, MongoDB |
| Authentication | JWT, bcryptjs |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (EKS) |
| CI/CD | Jenkins |
| Infrastructure | Terraform (AWS) |
| Configuration | Ansible |
| Monitoring | Prometheus, Grafana |
| Cloud Provider | AWS (EC2, EKS, VPC) |

## 🔑 Key Files to Customize

**📖 For detailed step-by-step customization instructions, see [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)**

Quick reference:

1. **backend/.env**: MongoDB URI, JWT Secret
   - Line-by-line: Set PORT, MONGODB_URI, JWT_SECRET, NODE_ENV

2. **frontend/js/api.js**: API_BASE_URL
   - Line-by-line: Update API endpoint URL for your deployment

3. **terraform/terraform.tfvars**: AWS region, instance types
   - Line-by-line: Configure AWS region, EC2 types, EKS settings

4. **ansible/inventory/hosts.ini**: Server IPs and credentials
   - Line-by-line: Add server IPs, usernames, SSH key paths

5. **k8s/backend-deployment.yaml**: Docker image registry
   - Line-by-line: Update Docker image URLs for your registry

6. **Jenkinsfile**: Docker registry and cluster names
   - Line-by-line: Configure registry URLs, AWS region, cluster names

7. **docker-compose.yml**: Environment variables
   - Line-by-line: Set JWT secrets, passwords, port mappings

## 🚀 Quick Reference

### Start Locally
```bash
docker-compose up -d --build
```

### Deploy Infrastructure
```bash
cd terraform && terraform apply
```

### Deploy to Kubernetes
```bash
kubectl apply -f k8s/
```

### Run Ansible Playbooks
```bash
cd ansible && ansible-playbook playbooks/install-docker.yml
```

### Setup Monitoring
```bash
kubectl apply -f monitoring/
```

---

**Total Files Created**: 60+ files
**Lines of Code**: ~10,000+
**Complete DevOps Pipeline**: ✅ Ready to Deploy

