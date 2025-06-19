    pipeline {
        agent any

        tools {
            maven 'Maven s/w' // Ensure this matches your Jenkins Global Tool Configuration
            jdk 'Java s/w'    // Ensure this matches your Jenkins Global Tool Configuration
        }

        stages {
            stage('Checkout Source Code') {
                steps {
                    script { //script block for better handling
                        git branch: 'main', url: 'git@github.com:ancientConnect/boujock-web-app.git',
                            credentialsId: 'github-ec2-key' // <---  credential ID
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
        }
    }
    
