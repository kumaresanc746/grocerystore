pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        DOCKER_IMAGE_PREFIX = 'grocery-store'
        KUBERNETES_NAMESPACE = 'grocery-store'
        AWS_REGION = 'eu-north-1'
        AWS_EKS_CLUSTER = 'grocery-store-cluster'
    }
    
    stages {
        stage('Git Pull') {
            steps {
                script {
                    echo 'Pulling latest code from Git repository'
                    sh '''
                        git pull origin main || true
                        git log -1 --oneline
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            echo 'Installing backend dependencies'
                            dir('backend') {
                                sh 'npm install'
                            }
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        script {
                            echo 'Checking frontend dependencies'
                            // Frontend is static HTML/CSS/JS, no npm install needed
                            sh 'echo "Frontend is static files, no dependencies to install"'
                        }
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend static files'
                    dir('frontend') {
                        sh '''
                            echo "Frontend build complete"
                            # In production, you might want to minify CSS/JS here
                        '''
                    }
                }
            }
        }
        
        stage('Docker Build') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo 'Building backend Docker image'
                            sh """
                                docker build -t ${DOCKER_IMAGE_PREFIX}-backend:${BUILD_NUMBER} ./backend
                                docker tag ${DOCKER_IMAGE_PREFIX}-backend:${BUILD_NUMBER} ${DOCKER_IMAGE_PREFIX}-backend:latest
                            """
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo 'Building frontend Docker image'
                            sh """
                                docker build -t ${DOCKER_IMAGE_PREFIX}-frontend:${BUILD_NUMBER} ./frontend
                                docker tag ${DOCKER_IMAGE_PREFIX}-frontend:${BUILD_NUMBER} ${DOCKER_IMAGE_PREFIX}-frontend:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo 'Running application tests'
                    // Add your test commands here
                    sh 'echo "Tests would run here"'
                }
            }
        }
        
        stage('Docker Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo 'Pushing Docker images to registry'
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}
                            docker push ${DOCKER_IMAGE_PREFIX}-backend:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE_PREFIX}-backend:latest
                            docker push ${DOCKER_IMAGE_PREFIX}-frontend:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE_PREFIX}-frontend:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    echo 'Deploying to Kubernetes cluster'
                    sh """
                        # Configure kubectl for EKS cluster
                        aws eks update-kubeconfig --name ${AWS_EKS_CLUSTER} --region ${AWS_REGION}
                        
                        # Update Kubernetes deployments with new images
                        kubectl set image deployment/backend-deployment backend=${DOCKER_IMAGE_PREFIX}-backend:${BUILD_NUMBER} -n ${KUBERNETES_NAMESPACE}
                        kubectl set image deployment/frontend-deployment frontend=${DOCKER_IMAGE_PREFIX}-frontend:${BUILD_NUMBER} -n ${KUBERNETES_NAMESPACE}
                        
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/ -n ${KUBERNETES_NAMESPACE}
                        
                        # Wait for rollout
                        kubectl rollout status deployment/backend-deployment -n ${KUBERNETES_NAMESPACE}
                        kubectl rollout status deployment/frontend-deployment -n ${KUBERNETES_NAMESPACE}
                        
                        echo "Deployment completed successfully"
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Performing health checks'
                    sh '''
                        # Wait a bit for services to be ready
                        sleep 10
                        
                        # Check backend health
                        curl -f http://localhost:3000/health || exit 1
                        
                        # Check frontend health
                        curl -f http://localhost/health || exit 1
                        
                        echo "Health checks passed"
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Add notifications here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add failure notifications here
        }
        always {
            script {
                // Cleanup
                sh '''
                    docker system prune -f || true
                '''
            }
        }
    }
}


