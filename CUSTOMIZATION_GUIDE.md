# 📝 Customization Guide - Step by Step Instructions

This guide provides detailed, line-by-step instructions for customizing all key files in the Grocery Store project.

## Table of Contents
1. [Backend Environment Variables](#1-backend-environment-variables)
2. [Frontend API Configuration](#2-frontend-api-configuration)
3. [Terraform Variables](#3-terraform-variables)
4. [Ansible Inventory](#4-ansible-inventory)
5. [Kubernetes Docker Images](#5-kubernetes-docker-images)
6. [Jenkins Configuration](#6-jenkins-configuration)
7. [Docker Compose Settings](#7-docker-compose-settings)

---

## 1. Backend Environment Variables

### File: `backend/.env`

**Step 1**: Navigate to the backend directory
```bash
cd backend
```

**Step 2**: Create the `.env` file (if it doesn't exist)
```bash
cp .env.example .env
```
*OR*
```bash
touch .env
```

**Step 3**: Open the `.env` file in a text editor
```bash
# Windows: notepad .env
# Linux/Mac: nano .env
```

**Step 4**: Add/Edit these lines one by one:

```
PORT=3000
```
- **Line 1**: `PORT=3000`
  - **What it does**: Sets the port where backend API runs
  - **When to change**: If port 3000 is already in use, change to 3001, 8000, etc.
  - **Example**: `PORT=8000`

```
MONGODB_URI=mongodb://mongo:27017/grocery-store
```
- **Line 2**: `MONGODB_URI=mongodb://mongo:27017/grocery-store`
  - **What it does**: MongoDB connection string
  - **For Docker Compose**: Keep as `mongodb://mongo:27017/grocery-store`
  - **For Local MongoDB**: Change to `mongodb://localhost:27017/grocery-store`
  - **For MongoDB Atlas**: Change to your Atlas connection string
  - **Example**: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery-store`

```
JWT_SECRET=your-secret-key-change-in-production
```
- **Line 3**: `JWT_SECRET=your-secret-key-change-in-production`
  - **What it does**: Secret key for JWT token encryption
  - **IMPORTANT**: Change this to a random, long string in production
  - **How to generate**: Use `openssl rand -base64 32` or any random string generator
  - **Example**: `JWT_SECRET=MySuperSecretKey1234567890!@#$%^&*`

```
NODE_ENV=production
```
- **Line 4**: `NODE_ENV=production`
  - **What it does**: Sets Node.js environment mode
  - **For development**: Change to `development`
  - **For production**: Keep as `production`

**Step 5**: Save the file

**Step 6**: Verify the file was created correctly
```bash
cat .env
# Should show all 4 lines above
```

---

## 2. Frontend API Configuration

### File: `frontend/js/api.js`

**Step 1**: Navigate to the frontend JavaScript directory
```bash
cd frontend/js
```

**Step 2**: Open `api.js` in a text editor
```bash
nano api.js
```

**Step 3**: Find this line (usually line 2 or 3):
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

**Step 4**: Change the URL based on your deployment:

**For Local Development:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```
- Keep as is if running backend on localhost port 3000

**For Docker Compose:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```
- Backend service is exposed on port 3000

**For Kubernetes (if using service name):**
```javascript
const API_BASE_URL = 'http://backend-service:3000/api';
```
- Internal Kubernetes service name

**For Production (your domain):**
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```
- Replace `yourdomain.com` with your actual domain

**For Kubernetes with Ingress:**
```javascript
const API_BASE_URL = '/api';
```
- Relative path works if same domain as frontend

**Step 5**: Save the file

**Step 6**: Verify changes
```bash
grep "API_BASE_URL" api.js
```

---

## 3. Terraform Variables

### File: `terraform/terraform.tfvars`

**Step 1**: Navigate to terraform directory
```bash
cd terraform
```

**Step 2**: Copy the example file
```bash
cp terraform.tfvars.example terraform.tfvars
```

**Step 3**: Open `terraform.tfvars` in a text editor
```bash
nano terraform.tfvars
```

**Step 4**: Customize each variable line by line:

```
aws_region = "us-east-1"
```
- **Line 1**: `aws_region = "us-east-1"`
  - **What it does**: AWS region where resources will be created
  - **Change to**: Your preferred AWS region
  - **Examples**: `"us-west-2"`, `"eu-west-1"`, `"ap-southeast-1"`
  - **How to choose**: Pick region closest to your users

```
project_name = "grocery-store"
```
- **Line 2**: `project_name = "grocery-store"`
  - **What it does**: Prefix for all AWS resource names
  - **Change to**: Your project name (lowercase, no spaces)
  - **Example**: `"my-grocery-app"`

```
vpc_cidr = "10.0.0.0/16"
```
- **Line 3**: `vpc_cidr = "10.0.0.0/16"`
  - **What it does**: IP address range for your VPC
  - **When to change**: If you have network conflicts
  - **Examples**: `"192.168.0.0/16"`, `"172.16.0.0/16"`

```
ec2_instance_type = "t3.medium"
```
- **Line 4**: `ec2_instance_type = "t3.medium"`
  - **What it does**: Size of EC2 instances
  - **For small projects**: `"t3.small"` or `"t3.micro"`
  - **For production**: `"t3.medium"` or `"t3.large"`
  - **Check AWS pricing**: Different sizes have different costs

```
ec2_key_name = "your-key-pair-name"
```
- **Line 5**: `ec2_key_name = "your-key-pair-name"`
  - **What it does**: SSH key pair name in AWS
  - **Step 5a**: Go to AWS Console → EC2 → Key Pairs
  - **Step 5b**: Create a new key pair or note existing name
  - **Step 5c**: Replace `"your-key-pair-name"` with actual name
  - **Example**: `"my-aws-key"`

```
eks_version = "1.28"
```
- **Line 6**: `eks_version = "1.28"`
  - **What it does**: Kubernetes version for EKS cluster
  - **When to change**: Use latest stable version
  - **Check**: AWS EKS supported versions

```
eks_node_instance_types = ["t3.medium"]
```
- **Line 7**: `eks_node_instance_types = ["t3.medium"]`
  - **What it does**: Instance types for Kubernetes worker nodes
  - **Example**: `["t3.small"]` for smaller, `["t3.large"]` for larger

```
eks_node_min_size = 2
```
- **Line 8**: `eks_node_min_size = 2`
  - **What it does**: Minimum number of worker nodes
  - **For testing**: Change to `1`
  - **For production**: Keep `2` or higher

```
eks_node_max_size = 4
```
- **Line 9**: `eks_node_max_size = 4`
  - **What it does**: Maximum number of worker nodes (auto-scaling)
  - **Adjust**: Based on expected traffic and budget

```
eks_node_desired_size = 2
```
- **Line 10**: `eks_node_desired_size = 2`
  - **What it does**: Initial number of worker nodes
  - **Should be**: Between min_size and max_size

**Step 5**: Save the file

**Step 6**: Verify syntax
```bash
terraform validate
```

---

## 4. Ansible Inventory

### File: `ansible/inventory/hosts.ini`

**Step 1**: Navigate to ansible directory
```bash
cd ansible/inventory
```

**Step 2**: Open `hosts.ini` in a text editor
```bash
nano hosts.ini
```

**Step 3**: Update server groups line by line:

**For Web Servers:**
```
[webservers]
web1 ansible_host=your-server-ip ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/your-key.pem
```
- **Line 1**: `[webservers]` - Group name (keep as is)
- **Line 2**: Replace parts:
  - `web1`: Name your server (can be anything)
  - `your-server-ip`: Replace with actual server IP address
    - **How to find**: AWS EC2 Console → Instances → Copy Public IP
    - **Example**: `54.123.45.67`
  - `ec2-user`: Username (keep `ec2-user` for Amazon Linux)
    - For Ubuntu: change to `ubuntu`
    - For CentOS: change to `centos`
  - `~/.ssh/your-key.pem`: Path to your SSH private key
    - **Step 3a**: Download key from AWS EC2 → Key Pairs
    - **Step 3b**: Save it to `~/.ssh/` directory
    - **Step 3c**: Change permissions: `chmod 400 ~/.ssh/your-key.pem`
    - **Step 3d**: Replace filename in the line
    - **Example**: `~/.ssh/grocery-store-key.pem`

**For Jenkins Servers:**
```
[jenkins_servers]
jenkins1 ansible_host=your-jenkins-ip ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/your-key.pem
```
- Follow same steps as web servers
- Replace `your-jenkins-ip` with Jenkins server IP

**For Kubernetes Masters:**
```
[k8s_masters]
k8s-master1 ansible_host=your-k8s-master-ip ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/your-key.pem
```
- Follow same steps as above
- Replace `your-k8s-master-ip` with K8s master IP

**Common Variables Section:**
```
[all:vars]
ansible_python_interpreter=/usr/bin/python3
```
- **Line 1**: `[all:vars]` - Section for all hosts (keep as is)
- **Line 2**: Python path - Usually keep as is, or change if Python is elsewhere

**Step 4**: Save the file

**Step 5**: Test connection
```bash
cd ..
ansible all -m ping
```

---

## 5. Kubernetes Docker Images

### File: `k8s/backend-deployment.yaml`

**Step 1**: Navigate to k8s directory
```bash
cd k8s
```

**Step 2**: Open `backend-deployment.yaml`
```bash
nano backend-deployment.yaml
```

**Step 3**: Find the image line (around line 15-20):
```yaml
image: grocery-store-backend:latest
```

**Step 4**: Replace with your Docker registry image:

**For Docker Hub:**
```yaml
image: your-dockerhub-username/grocery-store-backend:latest
```
- Replace `your-dockerhub-username` with your Docker Hub username
- **Example**: `johnsmith/grocery-store-backend:latest`

**For AWS ECR:**
```yaml
image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/grocery-store-backend:latest
```
- Replace parts:
  - `123456789012`: Your AWS account ID
  - `us-east-1`: Your AWS region
  - **Example**: `987654321098.dkr.ecr.eu-west-1.amazonaws.com/grocery-store-backend:latest`

**For Private Registry:**
```yaml
image: registry.example.com:5000/grocery-store-backend:latest
```
- Replace `registry.example.com:5000` with your registry URL

**Step 5**: Also update `imagePullPolicy` if needed (line below image):
```yaml
imagePullPolicy: IfNotPresent
```
- **Keep as is** for most cases
- Change to `Always` if you want to always pull latest

**Step 6**: Save the file

**Step 7**: Do the same for `frontend-deployment.yaml`:
```bash
nano frontend-deployment.yaml
```
- Find: `image: grocery-store-frontend:latest`
- Replace with your frontend image URL
- Save

---

## 6. Jenkins Configuration

### File: `Jenkinsfile`

**Step 1**: Open `Jenkinsfile` in project root
```bash
nano Jenkinsfile
```

**Step 2**: Find the environment section (around lines 4-9):

**Step 3**: Update each variable:

```
DOCKER_REGISTRY = 'your-registry.com'
```
- **Line 1**: Replace `'your-registry.com'` with your Docker registry URL
- **For Docker Hub**: `'docker.io'` or `'hub.docker.com'`
- **For AWS ECR**: `'123456789012.dkr.ecr.us-east-1.amazonaws.com'`
- **Example**: `'myregistry.com:5000'`

```
DOCKER_IMAGE_PREFIX = 'grocery-store'
```
- **Line 2**: Image name prefix (keep or change)
- **Example**: `'my-grocery-app'`

```
KUBERNETES_NAMESPACE = 'grocery-store'
```
- **Line 3**: K8s namespace name (usually keep as is)

```
AWS_REGION = 'us-east-1'
```
- **Line 4**: Your AWS region
- **Change to**: Same as in terraform.tfvars

```
AWS_EKS_CLUSTER = 'grocery-store-cluster'
```
- **Line 5**: EKS cluster name
- **Change to**: Your actual cluster name from Terraform output
- **How to find**: Run `terraform output eks_cluster_name`

**Step 4**: Find Docker Push stage (around line 80-100)
- Look for credentials ID line

**Step 5**: In Jenkins UI, configure credentials:
- **Step 5a**: Go to Jenkins → Manage Jenkins → Credentials
- **Step 5b**: Add credentials with ID: `docker-registry-credentials`
- **Step 5c**: Add your Docker registry username and password
- **Step 5d**: The Jenkinsfile will automatically use these credentials

**Step 6**: Save the file

---

## 7. Docker Compose Settings

### File: `docker-compose.yml`

**Step 1**: Open `docker-compose.yml` in project root
```bash
nano docker-compose.yml
```

**Step 2**: Customize environment variables:

**Backend Service (around line 30-40):**
```yaml
environment:
  PORT: 3000
  MONGODB_URI: mongodb://mongo:27017/grocery-store
  JWT_SECRET: your-secret-key-change-in-production
  NODE_ENV: production
```

- **Step 2a**: `PORT: 3000` - Keep or change port
- **Step 2b**: `MONGODB_URI` - Keep for Docker Compose (uses service name)
- **Step 2c**: `JWT_SECRET` - **IMPORTANT**: Change to a secure random string
  - Generate: `openssl rand -base64 32`
  - Or use a password manager to generate random string
- **Step 2d**: `NODE_ENV` - Change to `development` for dev, `production` for prod

**Mongo Express Service (around line 25):**
```yaml
environment:
  ME_CONFIG_BASICAUTH_USERNAME: admin
  ME_CONFIG_BASICAUTH_PASSWORD: admin123
```

- **Step 2e**: Change `admin` to your preferred username
- **Step 2f**: Change `admin123` to a strong password
- **For production**: Use strong passwords!

**Frontend Service (around line 65):**
```yaml
environment:
  - API_BASE_URL=http://localhost:3000/api
```

- **Step 2g**: Change URL if backend runs on different port or domain

**Step 3**: Change port mappings if needed:

**Backend Port (around line 35):**
```yaml
ports:
  - "3000:3000"
```
- Format: `"host-port:container-port"`
- Change `3000:3000` to `8000:3000` if you want backend on port 8000

**Frontend Port (around line 60):**
```yaml
ports:
  - "80:80"
```
- Change to `"8080:80"` if port 80 is in use

**Mongo Express Port (around line 27):**
```yaml
ports:
  - "8081:8081"
```
- Change if port 8081 conflicts with other services

**Step 4**: Save the file

**Step 5**: Test the configuration
```bash
docker-compose config
```
- Should show no errors

---

## 📋 Quick Checklist

Before deploying, verify you've customized:

- [ ] `backend/.env` - MongoDB URI, JWT Secret, Port
- [ ] `frontend/js/api.js` - API_BASE_URL
- [ ] `terraform/terraform.tfvars` - AWS region, key name, instance types
- [ ] `ansible/inventory/hosts.ini` - Server IPs, SSH keys
- [ ] `k8s/backend-deployment.yaml` - Docker image URL
- [ ] `k8s/frontend-deployment.yaml` - Docker image URL
- [ ] `Jenkinsfile` - Registry URL, cluster name
- [ ] `docker-compose.yml` - JWT Secret, passwords, ports

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong passwords** - Generate with password managers
3. **Rotate JWT secrets** - Change regularly in production
4. **Use secrets management** - AWS Secrets Manager, HashiCorp Vault
5. **Restrict SSH access** - Use key pairs, not passwords
6. **Enable HTTPS** - Use SSL certificates for production

---

## ❓ Common Issues & Solutions

**Issue**: Can't connect to MongoDB
- **Solution**: Check MONGODB_URI in `.env` matches your MongoDB setup

**Issue**: Frontend can't reach backend
- **Solution**: Verify API_BASE_URL in `api.js` is correct

**Issue**: Terraform fails with key pair error
- **Solution**: Ensure key pair exists in AWS and name matches in terraform.tfvars

**Issue**: Ansible can't connect to servers
- **Solution**: Check IP addresses, SSH key path, and security group allows SSH (port 22)

**Issue**: Kubernetes pods can't pull images
- **Solution**: Verify image URLs in deployment YAMLs and registry credentials

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Documentation](https://docs.ansible.com/)

---

**Last Updated**: 2024
**Version**: 1.0

