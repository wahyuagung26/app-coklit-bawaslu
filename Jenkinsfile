pipeline {
    agent any
    environment {
        SSH_USERNAME = 'u909598054'
        SSH_HOST     = '185.187.241.21'
        SSH_PORT     = '65002'
        SSH_PROJECT_DIRECTORY     = 'public_html/public_html/portofolio/bawaslu-app'
        SERVER_PASSWORD = 'Wahyuagung052*'
    }
     stages {
        stage('Build Development') {
                when { 
                    branch 'development';
                }
                steps {
                    sh 'npm install'
               }
        }
         stage('Build Production') {
                when { 
                    branch 'main';
                }
                steps {
                    // sh 'ssh -t remotehost "sudo <cmd>"'
                    // sh 'sudo mkdir -p dist'
                    // sh 'sudo chmod -R 755 dist'
                    sh 'npm install'
                    sh 'npm run build'
               }
          }
        stage('Deploy Development') {
                when { 
                    branch 'development';
                }
                steps {
                    sshagent(['ssh-app-bawaslu']) {
                         echo 'deploy to development'
                    }
               }
          }
          stage('Deploy Production') {
                when { 
                    branch 'main';
                }
                steps {
                    sshagent(['ssh-app-bawaslu']) {
                         echo 'deploy to development'
                    }
               }
          }
          stage('Send Notif') {
                steps {
                    echo 'send notif to discord'
               }
          }
     }
 }
 