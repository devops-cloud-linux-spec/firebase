pipeline{
    agent any
    tools{
        jdk 'jdk17'
        nodejs 'node18'
    }
    environment {
        SCANNER_HOME=tool 'sonar-scanner'
    }
    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git 'https://github.com/devops-cloud-linux-spec/firebase.git'
            }
        }
        stage("Sonarqube Analysis "){
            steps{
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=firebase \
                    -Dsonar.projectKey=firebase '''
                }
            }
        }
        stage("quality gate"){
           steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token' 
                }
            } 
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        stage("Docker Build & Push"){
            steps{
                script{
                   withDockerRegistry([credentialsId: 'prashikrk']){   
                       sh "docker build -t firebase ."
                       sh "docker tag firebase prashikrk/firebase:latest "
                       sh "docker push prashikrk/firebase:latest "
                    }
                }
            }
        }
        stage("TRIVY"){
            steps{
                sh "trivy image prashikrk/firebase:latest > trivy.txt" 
            }
        }
        stage('Deploy to container'){
            steps{
                sh 'docker run -d --name firebase -p 3010:3000 prashikrk/firebase:latest'
            }
        }
    }
}
