@echo off
echo Running tests with Firefox browser...
mvn clean test -Dtest=tests.HomePageTest "-Dselenide.browser=firefox"
pause