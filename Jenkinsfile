pipeline {
    agent any // Defines where the pipeline will run (on any available agent/node)

    tools {
        // These names MUST match exactly what you configured in Jenkins Global Tool Configuration
        // Go to Manage Jenkins -> Tools to verify these names.
        maven 'Maven s/w' // Ensure 'Maven s/w' is the exact name of your Maven installation
        jdk 'Java s/w'    // Ensure 'Java s/w' is the exact name of your JDK installation
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                // Ensure this is your correct GitHub repository URL
                git branch: 'main', url: 'git@github.com:ancientConnect/boujock-web-app.git'
            }
        }
        stage('Build WAR Artifact') {
            steps {
                script {
                    // Maven will package your src/main/webapp into a WAR file
                    sh 'mvn clean install'
                }
            }
        }
        // For a static site, extensive unit/integration tests might not apply.
        // You could add linters (e.g., for HTML/CSS/JS) here as a 'Test' stage.
        // Uncomment and adjust if you have Node.js and linters installed on your Jenkins agent.
        // stage('Lint Code (Optional)') {
        //     steps {
        //         sh 'npm install -g html-linter css-linter' // Example: requires Node.js on Jenkins agent
        //         sh 'html-linter index.html' // Adjust commands as needed
        //         sh 'css-linter style.css'
        //     }
        // }
        stage('Archive Artifact') {
            steps {
                // Archive the generated WAR file for later deployment
                archiveArtifacts artifacts: 'target/*.war', fingerprint: true
            }
        }
    }
}
