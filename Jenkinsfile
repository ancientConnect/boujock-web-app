Groovy​
pipeline {​
agent any // tells where the pipeline will run ,in this case on any available agent/node​
​
tools {​
// tools configured in Jenkins Global Tool
Configuration​
maven 'Maven s/w' // my Maven installation​
jdk 'Java s/w' // my JDK installation​
}​
​
stages {​
stage('Checkout Source Code') {​
steps {​
git branch: 'main', url: 'git@github.com:ancientConnect/boujock-web-app.git' // my repo
URL​
}​
}​
stage('Build WAR Artifact') {​
steps {​
script {​
// Maven will package  src/main/webapp into a WAR file​
sh 'mvn clean install'​}​
}​
}​​
// linters (e.g., for HTML/CSS/JS) can be added here as a Test stage.​
// stage('Lint Code (Optional)') {​
// steps {​
//
sh 'npm install -g html-linter css-linter' // e.g requires Node.js on
Jenkins agent​
//
sh 'html-linter index.html' // commands to be adjusted as needed​
//
sh 'css-linter style.css'​
// }​
// }​
stage('Archive Artifact') {​
steps {​
// archiving the generated WAR file for later deployment​
archiveArtifacts artifacts: 'target/*.war', fingerprint: true​
}​
}​
}​
}​Groovy​
pipeline {​
agent any // Defines where the pipeline will run (on any available agent/node)​
​
tools {​
// These names must match what you configured in Jenkins Global Tool
Configuration​
maven 'M3' // Replace 'M3' with the name you gave your Maven installation​
jdk 'JDK17' // Replace 'JDK17' with the name you gave your JDK installation​
}​
​
stages {​
stage('Checkout Source Code') {​
steps {​
git branch: 'main', url: 'YOUR_GIT_REPO_URL' // Replace with your actual repo
URL​
}​
}​
stage('Build WAR Artifact') {​
steps {​
script {​
// Maven will package your src/main/webapp into a WAR file​
sh 'mvn clean install'​}​
}​
}​
// For a static site, extensive unit/integration tests might not apply.​
// You could add linters (e.g., for HTML/CSS/JS) here as a 'Test' stage.​
// stage('Lint Code (Optional)') {​
// steps {​
//
sh 'npm install -g html-linter css-linter' // Example: requires Node.js on
Jenkins agent​
//
sh 'html-linter index.html' // Adjust commands as needed​
//
sh 'css-linter style.css'​
// }​
// }​
stage('Archive Artifact') {​
steps {​
// Archive the generated WAR file for later deployment​
archiveArtifacts artifacts: 'target/*.war', fingerprint: true​
}​
}​
}​
}​
