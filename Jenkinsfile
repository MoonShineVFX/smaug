library 'moonshine'
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t smaug .'
            }
        }
        stage('Deploy') {
            steps {
                serverUpdate('smaug')
            }
        }
    }
}