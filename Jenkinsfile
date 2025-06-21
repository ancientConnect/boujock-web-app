pipeline {
    agent any

    tools {
        maven 'Maven s/w' // name my Maven installation
        jdk 'Java s/w'    // name of my JDK installation
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                script {
                    git branch: 'main', url: 'git@github.com:ancientConnect/boujock-web-app.git',
                        credentialsId: 'github-ec2-key' // this is my Jenkins credential ID
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
        //this stage is for deployment to tomcat
        stage('Deploy to Tomcat') {
            steps {
                script {
                    // tomcat service will be temporarily stopped for safe deployment
                    sh 'sudo systemctl stop tomcat' 

                    // copying the WAR file to Tomcat's webapps directory
                    sh 'sudo cp target/*.war /home/ec2-user/apache-tomcat-9.0.106/webapps'
                    // start Tomcat service
                    sh 'sudo systemctl start tomcat' 
                    // now here's a sign of victory! 
                    echo "Deployed WAR file to Tomcat successfully!"
                    // i mean it's a win right
                }
            }
        }
    }
}
