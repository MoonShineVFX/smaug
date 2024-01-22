library 'moonshine'
pipeline {
    agent any
    environment {
        DATABASE_URL = credentials('smaug-db-url')
    }
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t smaug .'
            }
        }
        stage('DB Migration'){
            steps {
                sh "docker run --rm --network=host -e DATABASE_URL=$DATABASE_URL smaug npx prisma migrate deploy"
            }
        }
        stage('Deploy') {
            steps {
                serverUpdate('smaug')
            }
        }
    }
}