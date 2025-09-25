# Use lightweight base image with Java and Maven
FROM openjdk:21-jdk-slim

# Install Maven and Chrome dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    maven \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome path
ENV CHROME_BIN=/usr/bin/google-chrome

# Create working directory
WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Create output directories
RUN mkdir -p target/allure-results target/logs target/screenshots

# Run tests in headless mode
CMD ["mvn", "clean", "test", "-Dselenide.headless=true"]