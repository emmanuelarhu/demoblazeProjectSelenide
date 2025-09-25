@echo off

REM Docker test runner for DemoBlaze tests (JUnit + BDD Cucumber) - Windows

setlocal

set IMAGE_NAME=demoblaze-tests
set TEST_TYPE=%1
set BROWSER=%2
set HEADLESS=%3

if "%TEST_TYPE%"=="" set TEST_TYPE=all
if "%BROWSER%"=="" set BROWSER=chrome
if "%HEADLESS%"=="" set HEADLESS=true

echo 🐳 Building Docker image...
docker build -t %IMAGE_NAME% .

echo 🧪 Running %TEST_TYPE% tests in Docker with %BROWSER%...

REM Create output directories
if not exist "target" mkdir "target"
if not exist "target\allure-results" mkdir "target\allure-results"
if not exist "target\logs" mkdir "target\logs"
if not exist "target\screenshots" mkdir "target\screenshots"
if not exist "target\surefire-reports" mkdir "target\surefire-reports"
if not exist "target\cucumber-reports" mkdir "target\cucumber-reports"

REM Build test command based on parameters
if "%TEST_TYPE%"=="all" (
    set TEST_COMMAND=mvn clean test ^&^& mvn test -Dtest=runners.CucumberTestRunner
) else if "%TEST_TYPE%"=="junit-only" (
    set TEST_COMMAND=mvn clean test
) else if "%TEST_TYPE%"=="bdd-only" (
    set TEST_COMMAND=mvn clean test -Dtest=runners.CucumberTestRunner
) else (
    echo ❌ Invalid test type. Use: all, junit-only, or bdd-only
    exit /b 1
)

REM Add browser and headless configuration
set TEST_COMMAND=%TEST_COMMAND% -Dselenide.browser=%BROWSER%
if "%HEADLESS%"=="true" (
    set TEST_COMMAND=%TEST_COMMAND% -Dselenide.headless=true
)

REM Run tests with volume mounts
docker run --rm ^
    -v "%cd%\target:/app/target" ^
    --shm-size=2g ^
    -e DISPLAY=:99 ^
    %IMAGE_NAME% ^
    sh -c "Xvfb :99 -screen 0 1920x1080x24 & %TEST_COMMAND%"

echo ✅ Test execution completed!
echo 📋 Results are available in:
echo    - JUnit Reports: target\surefire-reports\
echo    - BDD Reports: target\cucumber-reports\
echo    - Allure Results: target\allure-results\
echo    - Screenshots: target\screenshots\
echo    - Logs: target\logs\

REM Check if Allure results exist and generate report
if exist "target\allure-results" (
    echo 📊 Generating Allure report...
    allure generate target\allure-results -o target\allure-report --clean 2>nul && (
        echo 📊 Allure report generated: target\allure-report\index.html
    ) || (
        echo ⚠️  Allure not installed locally. Install Allure to generate reports.
    )
)

endlocal