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
    // this stage is for HTML Proofer test
        stage('HTML Proofer') {
            steps {
                script {
                    echo "Running HTML Proofer..."
                    //this html-proofer runs against HTML, CSS, JS, and other static assets in src/main/webapp directory
                    try {
                        // The following command will tell Bundler to install gems into './vendor/bundle'
                        // within my Jenkins workspace for this project.
                        // This ensures the Jenkins user has write access for gem installation.
                        sh 'bundle config set --local path \'vendor/bundle\''

                        // checking if a Gemfile exists, if so, install dependencies
                        sh """
                            if [ -f Gemfile ]; then
                                echo "Gemfile found, running bundle install..."
                                bundle install
                            else
                                echo "No Gemfile found, assuming html-proofer is globally available."
                            fi
                        """
                        // executiom of html-proofer using bundle exec and update options.
                        sh 'bundle exec htmlproofer ./src/main/webapp --checks html,favicon,script,link_external --allow-missing-href'
                        // --checks html,favicon,script,link_external: validates HTML syntax, checks for favicon.ico, checks for broken script tags, and checks external links
                        // --allow-missing-href: allows <a> tags without href attributes
                        echo "HTML Proofer completed successfully."
                    } catch (e) {
                        // the interpolation `${e}` can sometimes cause Groovy compilation errors
                        // in Jenkins' CPS transformation explicitly converting the exception to a string
                        // avoids this issue.
                        echo "HTML Proofer found issues and failed: " + e.toString()
                        error "HTML Proofer issues detected. Please check the build logs."
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
