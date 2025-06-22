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

        // New Stage: HTML Proofer
        stage('HTML Proofer') {
            steps {
                script {
                    echo "Running HTML Proofer..."
                    try {
                        // This command tells Bundler to install gems into './vendor/bundle'
                        // within your Jenkins workspace for this project.
                        sh 'bundle config set --local path \'vendor/bundle\''

                        // Check if a Gemfile exists, if so, install dependencies
                        sh """
                            if [ -f Gemfile ]; then
                                echo "Gemfile found, running bundle install..."
                                bundle install
                            else
                                echo "No Gemfile found, assuming html-proofer is globally available."
                            fi
                        """
                        // Execute html-proofer against the webapp directory
                        sh 'htmlproofer ./src/main/webapp --check-html --check-favicon --check-scripts --check-external-links --allow-missing-href --internal-domains "localhost,127.0.0.1,yourproductiondomain.com"'

                        echo "HTML Proofer completed successfully."
                    } catch (e) {
                        echo "HTML Proofer found issues or failed: ${e}" [cite: 113]
                        error "HTML Proofer issues detected. Please check the build logs." [cite: 114]
                    }
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
