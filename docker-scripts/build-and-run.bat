@echo off

REM Build and run DemoBlaze Selenium tests in Docker (Windows)

setlocal enabledelayedexpansion

REM Configuration
set IMAGE_NAME=demoblaze-selenium-tests
set CONTAINER_NAME=demoblaze-test-run

REM Get build number or use local timestamp
if "%BUILD_NUMBER%"=="" (
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a%%b
    set BUILD_NUMBER=local-!mydate!-!mytime!
)

echo 🐳 Building Docker image...
docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .
docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:latest

echo 🧪 Running tests in Docker container...

REM Create directories for outputs
if not exist "target\allure-results" mkdir "target\allure-results"
if not exist "target\logs" mkdir "target\logs"
if not exist "target\screenshots" mkdir "target\screenshots"
if not exist "target\surefire-reports" mkdir "target\surefire-reports"

REM Run tests with volume mounts for outputs
docker run --rm ^
    --name %CONTAINER_NAME% ^
    -v "%cd%\target\allure-results:/app/target/allure-results" ^
    -v "%cd%\target\logs:/app/target/logs" ^
    -v "%cd%\target\screenshots:/app/target/screenshots" ^
    -v "%cd%\target\surefire-reports:/app/target/surefire-reports" ^
    -e SELENIDE_HEADLESS=true ^
    -e SELENIDE_BROWSER=chrome ^
    -e SELENIDE_BROWSER_SIZE=1920x1080 ^
    %IMAGE_NAME%:%BUILD_NUMBER%

REM Check test results
if %errorlevel% equ 0 (
    echo ✅ Tests completed successfully!
) else (
    echo ❌ Tests failed!
    exit /b 1
)

REM Generate Allure report if allure is available
where allure >nul 2>nul
if %errorlevel% equ 0 (
    echo 📊 Generating Allure report...
    allure generate target\allure-results -o target\allure-report --clean
    echo 📋 Allure report generated in target\allure-report
    echo 💡 Run 'allure serve target\allure-results' to view the report
) else (
    echo ⚠️  Allure not found. Install Allure to generate HTML reports.
)

REM Cleanup
echo 🧹 Cleaning up Docker image...
docker rmi %IMAGE_NAME%:%BUILD_NUMBER%

echo 🎉 Test execution completed!
endlocal