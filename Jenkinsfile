pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-img"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch detected: ${env.BRANCH_NAME}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${env.BRANCH_NAME} ."
            }
        }

        stage('Deploy to Dev') {
            when {
                expression { env.BRANCH_NAME?.startsWith('develop') }
            }
            steps {
                echo "Deploying to DEV environment → http://localhost:3001"
                sh '''
                    docker-compose -f docker-compose.dev.yaml down || true
                    docker-compose -f docker-compose.dev.yaml up -d
                '''
            }
        }

        stage('Deploy to QA') {
            when {
                branch 'qa'
            }
            steps {
                echo "Deploying to QA environment → http://localhost:3002"
                sh '''
                    docker-compose -f docker-compose.qa.yaml down || true
                    docker-compose -f docker-compose.qa.yaml up -d
                '''
            }
        }

        stage('Deploy to UAT') {
            when {
                branch 'uat'
            }
            steps {
                echo "Deploying to UAT environment → http://localhost:3003"
                sh '''
                    docker-compose -f docker-compose.uat.yaml down || true
                    docker-compose -f docker-compose.uat.yaml up -d
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS — Branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "❌ Pipeline FAILED — Branch: ${env.BRANCH_NAME}"
        }
    }
}
