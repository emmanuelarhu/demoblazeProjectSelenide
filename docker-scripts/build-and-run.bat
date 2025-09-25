@echo off

REM Simple Docker test runner for DemoBlaze Selenium tests (Windows)

setlocal

set IMAGE_NAME=demoblaze-tests
set TEST_COMMAND=%1
if "%TEST_COMMAND%"=="" set TEST_COMMAND=mvn clean test -Dselenide.headless=true

echo 🐳 Building Docker image...
docker build -t %IMAGE_NAME% .

echo 🧪 Running tests in Docker...

REM Create output directories
if not exist "target" mkdir "target"
if not exist "target\allure-results" mkdir "target\allure-results"
if not exist "target\logs" mkdir "target\logs"
if not exist "target\screenshots" mkdir "target\screenshots"
if not exist "target\surefire-reports" mkdir "target\surefire-reports"

REM Run tests with volume mounts
docker run --rm ^
    -v "%cd%\target:/app/target" ^
    %IMAGE_NAME% ^
    %TEST_COMMAND%

echo ✅ Test execution completed!
echo 📋 Results are in target\ directory

endlocal