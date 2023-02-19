pipeline {
    agent any
    environment {
        SSH_USERNAME = 'u909598054'
        SSH_HOST     = '185.187.241.21'
        SSH_PORT     = '65002'
        SSH_PROJECT_DIRECTORY     = 'public_html/public_html/portofolio/bawaslu-api'
    }
     stages {
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
 