# Use lightweight base image with Java and Maven
FROM openjdk:21-jdk-slim

# Install system dependencies for Chrome, Firefox, and testing
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    maven \
    wget \
    gnupg \
    curl \
    unzip \
    firefox-esr \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install Allure for report generation
RUN ALLURE_VERSION="2.30.0" \
    && curl -o allure-commandline.zip -L "https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/${ALLURE_VERSION}/allure-commandline-${ALLURE_VERSION}.zip" \
    && unzip -q allure-commandline.zip \
    && mv allure-${ALLURE_VERSION} /opt/allure \
    && ln -s /opt/allure/bin/allure /usr/bin/allure \
    && rm allure-commandline.zip

# Install Python for any additional scripting needs
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Apache JMeter for performance testing
RUN JMETER_VERSION="5.6.2" \
    && wget -q "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz" \
    && tar -xzf "apache-jmeter-${JMETER_VERSION}.tgz" \
    && mv "apache-jmeter-${JMETER_VERSION}" /opt/apache-jmeter \
    && ln -s /opt/apache-jmeter/bin/jmeter /usr/local/bin/jmeter \
    && ln -s /opt/apache-jmeter/bin/jmeter.sh /usr/local/bin/jmeter.sh \
    && rm "apache-jmeter-${JMETER_VERSION}.tgz" \
    && chmod +x /opt/apache-jmeter/bin/jmeter \
    && chmod +x /opt/apache-jmeter/bin/jmeter.sh

# Set browser paths and display for headless mode
ENV CHROME_BIN=/usr/bin/google-chrome
ENV FIREFOX_BIN=/usr/bin/firefox
ENV DISPLAY=:99

# Create working directory
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Create output directories with proper permissions
RUN mkdir -p target/allure-results target/logs target/screenshots target/allure-report target/cucumber-reports \
    && chmod -R 777 target/

# Default command runs all tests (both JUnit and BDD Cucumber)
CMD ["mvn", "clean", "test", "-Dselenide.headless=true", "-Dselenide.browser=chrome"]