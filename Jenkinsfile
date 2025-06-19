pipeline {
    agent any

    tools {
        // These names MUST match exactly what you configured in Jenkins Global Tool Configuration
        // Go to Manage Jenkins -> Tools to verify these names.
        maven 'Maven s/w' // Ensure 'Maven s/w' is the exact name of your Maven installation
        jdk 'Java s/w'    // Ensure 'Java s/w' is the exact name of your JDK installation
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    git branch: 'main', url: 'git@github.com:ancientConnect/boujock-web-app.git',
                        credentialsId: 'github-ec2-key' // Ensure 'github-ec2-key' is your correct Jenkins credential ID
                }
            }
        }
        stage('Build WAR Artifact') {
            steps {
                script {
                    sh 'mvn clean install'
                }
            }
        }
        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'target/*.war', fingerprint: true
            }
        }
        // NEW STAGE FOR LOCAL DEPLOYMENT TO TOMCAT
        stage('Deploy to Tomcat') {
            steps {
                script {
                    // Stop Tomcat service temporarily for safe deployment (optional, but recommended for production)
                    // Replace 'tomcat' with your actual Tomcat service name (e.g., 'tomcat9', 'tomcat8')
                    sh 'sudo systemctl stop tomcat' 

                    // Copy the WAR file to Tomcat's webapps directory
                    // !!! IMPORTANT: Replace /path/to/tomcat/webapps/ with the actual path on your EC2 instance !!!
                    sh 'sudo cp target/*.war /path/to/tomcat/webapps/'

                    // Start Tomcat service
                    // Replace 'tomcat' with your actual Tomcat service name (e.g., 'tomcat9', 'tomcat8')
                    sh 'sudo systemctl start tomcat' 

                    echo "Deployed WAR file to Tomcat successfully!"
                }
            }
        }
    }
}
