# Selenide Reference Guide

This document provides a comprehensive reference for Selenide usage in this test automation framework.

## 🔧 **Selenide Configuration**

### **System Properties (Runtime Configuration)**
```bash
# Browser selection
-Dselenide.browser=chrome          # Default browser
-Dselenide.browser=firefox         # Firefox browser
-Dselenide.browser=edge            # Microsoft Edge

# Browser modes
-Dselenide.headless=true          # Run in headless mode
-Dselenide.headless=false         # Run with GUI (default)

# Browser window settings
-Dselenide.browserSize=1920x1080  # Set browser window size
-Dselenide.browserSize=1366x768   # Alternative size
-Dselenide.startMaximized=true    # Start maximized

# Timeouts
-Dselenide.timeout=10000          # Element timeout (10 seconds)
-Dselenide.timeout=4000           # Default timeout (4 seconds)
-Dselenide.pollingInterval=200    # Polling interval in ms

# Screenshots and reporting
-Dselenide.screenshots=true       # Enable screenshots (default)
-Dselenide.savePageSource=true    # Save page source on failures
-Dselenide.reportsFolder=target/screenshots  # Screenshots location
```

### **Example Runtime Commands**
```bash
# Chrome headless with custom timeout
mvn test -Dselenide.browser=chrome -Dselenide.headless=true -Dselenide.timeout=8000

# Firefox with large window size
mvn test -Dselenide.browser=firefox -Dselenide.browserSize=1920x1080

# Maximized Chrome with screenshots enabled
mvn test -Dselenide.browser=chrome -Dselenide.startMaximized=true -Dselenide.screenshots=true
```

## 🎯 **Element Location**

### **Basic Selectors**
```java
// By ID
$(By.id("elementId"))
$("#elementId")

// By CSS selector
$(By.cssSelector(".className"))
$(".className")
$("input[type='text']")

// By XPath
$(By.xpath("//button[text()='Click Me']"))
$x("//button[text()='Click Me']")

// By tag name
$(By.tagName("button"))
$("button")

// By name attribute
$(By.name("username"))
$("[name='username']")

// By class name
$(By.className("btn-primary"))
$(".btn-primary")
```

### **Advanced Selectors**
```java
// Multiple classes
$(".btn.btn-primary")

// Attribute contains
$("[class*='btn']")

// Attribute starts with
$("[id^='submit']")

// Attribute ends with
$("[id$='button']")

// Pseudo selectors
$("li:first-child")
$("li:last-child")
$("li:nth-child(2)")

// Complex XPath
$x("//div[@class='container']//button[contains(text(), 'Submit')]")
```

## 🎪 **Element Collections**

### **Working with Multiple Elements**
```java
// Get collection
ElementsCollection items = $$(".item");
ElementsCollection rows = $$x("//table//tr");

// Collection operations
items.shouldHave(size(5));
items.shouldHave(sizeGreaterThan(3));
items.shouldHave(sizeLessThan(10));

// Filter collections
items.filterBy(visible).shouldHave(size(3));
items.filterBy(text("Active")).shouldHave(size(2));

// Find in collection
items.findBy(text("Item 1")).click();
items.find(attribute("data-id", "123")).click();

// Get by index
items.get(0).click();  // First item
items.first().click(); // Same as get(0)
items.last().click();  // Last item
```

### **Collection Assertions**
```java
// Size assertions
$$(".product").shouldHave(size(6));
$$(".error").shouldHave(sizeGreaterThan(0));
$$(".warning").shouldBe(empty);

// Text assertions
$$(".item").shouldHave(texts("Item 1", "Item 2", "Item 3"));
$$(".price").shouldHave(textsInAnyOrder("$10", "$20", "$15"));

// Attribute assertions
$$("input").shouldHave(attributes("type", "text", "email", "password"));
```

## ⚡ **Actions**

### **Mouse Actions**
```java
// Basic clicks
element.click();
element.doubleClick();
element.contextClick(); // Right click

// Click with coordinates
element.click(ClickOptions.usingDefaultMethod().offset(10, 20));

// Hover actions
element.hover();
```

### **Keyboard Actions**
```java
// Text input
element.setValue("text");      // Clear and type
element.append("more text");   // Append to existing
element.clear();              // Clear field

// Special keys
element.sendKeys(Keys.ENTER);
element.sendKeys(Keys.TAB);
element.sendKeys(Keys.ESCAPE);

// Key combinations
element.sendKeys(Keys.CONTROL, "a"); // Ctrl+A
element.sendKeys(Keys.CONTROL, "c"); // Ctrl+C
```

### **Form Interactions**
```java
// Select dropdown
element.selectOption("Option Text");
element.selectOptionByValue("optionValue");
element.selectOptionContainingText("Partial");

// Radio buttons and checkboxes
element.setSelected(true);   // Check/select
element.setSelected(false);  // Uncheck/deselect

// File uploads
element.uploadFile(new File("path/to/file.txt"));
element.uploadFromClasspath("test-files/image.png");
```

## ✅ **Assertions and Conditions**

### **Visibility Conditions**
```java
// Basic visibility
element.shouldBe(visible);
element.shouldBe(hidden);
element.shouldNotBe(visible);

// Existence
element.should(exist);
element.should(not(exist));
element.shouldNot(exist);
```

### **State Conditions**
```java
// Element state
element.shouldBe(enabled);
element.shouldBe(disabled);
element.shouldBe(selected);   // For checkboxes/radio
element.shouldBe(checked);    // Alternative for checkboxes

// Focus
element.shouldBe(focused);
```

### **Text Conditions**
```java
// Exact text
element.shouldHave(text("Expected Text"));
element.shouldHave(exactText("Exact Match"));

// Partial text
element.shouldHave(textCaseSensitive("Case Sensitive"));
element.shouldHave(partialText("Partial"));

// Empty text
element.shouldHave(empty);
element.shouldNotHave(empty);
```

### **Attribute Conditions**
```java
// Attribute presence and values
element.shouldHave(attribute("id"));
element.shouldHave(attribute("class", "btn-primary"));
element.shouldHave(attributeMatching("data-id", "\\d+"));

// CSS properties
element.shouldHave(cssProperty("color", "red"));
element.shouldHave(cssValue("display", "block"));

// CSS classes
element.shouldHave(cssClass("active"));
element.shouldNotHave(cssClass("disabled"));
```

### **Value Conditions**
```java
// Input values
element.shouldHave(value("Expected Value"));
element.shouldHave(empty); // For empty inputs
element.shouldNotHave(value("Unexpected"));
```

## 🕐 **Waits and Timeouts**

### **Explicit Waits**
```java
// Wait for condition
element.waitUntil(visible, 10000);        // 10 seconds
element.waitUntil(clickable, Duration.ofSeconds(15));

// Wait while condition is true
element.waitWhile(hidden, 5000);

// Custom conditions
Wait<WebDriver> wait = new WebDriverWait(WebDriverRunner.getWebDriver(), Duration.ofSeconds(10));
wait.until(ExpectedConditions.titleContains("Expected Title"));
```

### **Timeout Configuration**
```java
// Set timeout for specific action
using(TIMEOUT, Duration.ofSeconds(10), () -> {
    element.shouldBe(visible);
    return null;
});

// Global timeout configuration (in configuration)
Configuration.timeout = 8000; // 8 seconds
```

## 🌐 **Browser Navigation**

### **Basic Navigation**
```java
// Open URL
open("https://example.com");
open("/relative/path");

// Navigation
back();
forward();
refresh();

// Get current page info
String currentUrl = url();
String title = title();
String pageSource = source();
```

### **Window Management**
```java
// Switch windows/tabs
switchTo().window(0);           // By index
switchTo().window("windowName"); // By name

// Get window handles
Set<String> handles = getWebDriver().getWindowHandles();

// Close current window
closeWindow();
closeWebDriver(); // Close browser entirely
```

### **Frame Handling**
```java
// Switch to frame
switchTo().frame("frameName");
switchTo().frame(0);                    // By index
switchTo().frame($(By.id("frameId")));  // By element

// Switch back
switchTo().defaultContent();
switchTo().parentFrame();
```

## 🚨 **Alert Handling**

### **JavaScript Alerts**
```java
// Basic alert operations
String alertText = switchTo().alert().getText();
switchTo().alert().accept();  // Click OK
switchTo().alert().dismiss(); // Click Cancel

// Type in prompt
switchTo().alert().sendKeys("Input text");

// With confirmation
confirm("Are you sure?");
prompt("Enter value:", "default");
alert("Message");
```

## 📸 **Screenshots and Reporting**

### **Manual Screenshots**
```java
// Take screenshot
String screenshotPath = screenshot("test-screenshot");
File screenshot = Screenshots.takeScreenShotAsFile();

// Screenshot with specific name
String path = screenshot("failure-" + System.currentTimeMillis());
```

### **Automatic Screenshots**
```java
// Configure automatic screenshots
Configuration.screenshots = true;           // Enable (default)
Configuration.savePageSource = true;        // Save HTML source
Configuration.reportsFolder = "target/screenshots";

// Screenshots are automatically taken on:
// - Test failures
// - shouldBe/shouldHave assertion failures
// - Timeouts
```

## 🔍 **Advanced Features**

### **Page Object Pattern**
```java
public class LoginPage {
    private SelenideElement usernameField = $("#username");
    private SelenideElement passwordField = $("#password");
    private SelenideElement loginButton = $(".btn-login");

    public LoginPage enterUsername(String username) {
        usernameField.setValue(username);
        return this;
    }

    public LoginPage enterPassword(String password) {
        passwordField.setValue(password);
        return this;
    }

    public DashboardPage clickLogin() {
        loginButton.click();
        return new DashboardPage();
    }
}
```

### **Custom Conditions**
```java
// Create custom condition
public static Condition exactValue(String expectedValue) {
    return new Condition("exact value") {
        @Override
        public boolean apply(WebElement element) {
            return expectedValue.equals(element.getAttribute("value"));
        }
    };
}

// Use custom condition
element.shouldHave(exactValue("Expected"));
```

### **Selenide Listeners**
```java
// Test listener for custom actions
public class CustomTestListener implements TestListener {
    @Override
    public void beforeTest(Method method, Object[] args) {
        // Setup before test
    }

    @Override
    public void afterTest(Method method, Object[] args, TestResult result) {
        // Cleanup after test
    }
}

// Register listener
SelenideLogger.addListener("customListener", new AllureSelenide());
```

## 🐛 **Debugging**

### **Debug Information**
```java
// Get element information
System.out.println("Element text: " + element.text());
System.out.println("Element value: " + element.val());
System.out.println("Element attribute: " + element.attr("class"));

// Check element state
System.out.println("Is visible: " + element.isDisplayed());
System.out.println("Is enabled: " + element.isEnabled());
System.out.println("Is selected: " + element.isSelected());

// Get all attributes
System.out.println("All attributes: " + element.getSize());
```

### **Common Debugging Commands**
```bash
# Run with debug logging
mvn test -Dtest=YourTest -X

# Disable headless for visual debugging
mvn test -Dtest=YourTest -Dselenide.headless=false

# Increase timeout for debugging
mvn test -Dtest=YourTest -Dselenide.timeout=30000

# Take screenshots on every step
mvn test -Dtest=YourTest -Dselenide.screenshots=true
```

## 📱 **Mobile and Responsive**

### **Mobile Simulation**
```java
// Set mobile user agent
Configuration.browserVersion = "mobile";

// Set mobile viewport
Configuration.browserSize = "375x667"; // iPhone size

// Mobile-specific selectors
SelenideElement mobileMenu = $(".mobile-menu");
SelenideElement hamburger = $(".hamburger-menu");
```

### **Responsive Testing**
```java
// Test different screen sizes
String[] sizes = {"1920x1080", "1366x768", "768x1024", "375x667"};

for (String size : sizes) {
    Configuration.browserSize = size;
    open("/");
    // Run responsive tests
}
```

## 🔧 **Performance**

### **Performance Configuration**
```java
// Faster execution settings
Configuration.fastSetValue = true;        // Fast text input
Configuration.clickViaJs = false;         // Use native clicks
Configuration.versatileSetValue = true;   // Handle different input types

// Polling settings
Configuration.pollingInterval = 100;      // Check every 100ms
```

### **Performance Best Practices**
```java
// Use specific selectors
$("#specific-id")           // ✅ Good
$x("//div[@id='specific']") // ❌ Slower

// Reuse elements
SelenideElement button = $("#submit-btn");
button.shouldBe(visible);
button.click(); // ✅ Reuse

// Avoid unnecessary waits
element.shouldBe(visible, Duration.ofSeconds(2)); // ✅ Specific timeout
```

## 📋 **Configuration Examples**

### **BaseTest Configuration**
```java
@BeforeEach
void setUp() {
    Configuration.browser = System.getProperty("selenide.browser", "chrome");
    Configuration.browserSize = System.getProperty("selenide.browserSize", "1920x1080");
    Configuration.headless = Boolean.parseBoolean(System.getProperty("selenide.headless", "false"));
    Configuration.screenshots = true;
    Configuration.savePageSource = true;
    Configuration.reportsFolder = "target/screenshots";
    Configuration.timeout = 6000;
}

@AfterEach
void tearDown() {
    closeWebDriver();
}
```

### **Custom Configuration Class**
```java
public class SelenideConfig {
    public static void setupBrowser() {
        Configuration.browser = "chrome";
        Configuration.browserVersion = "latest";
        Configuration.browserSize = "1920x1080";
        Configuration.headless = false;
        Configuration.screenshots = true;
        Configuration.savePageSource = true;
        Configuration.reportsFolder = "target/screenshots";
        Configuration.timeout = 6000;
        Configuration.pollingInterval = 200;
        Configuration.fastSetValue = true;
        Configuration.clickViaJs = false;
    }
}
```

## 🚀 **Best Practices**

### **Element Selection**
```java
// ✅ Good practices
$("#unique-id")                    // Use IDs when available
$("[data-testid='element']")       // Use test attributes
$(".specific-class")               // Use specific classes
$x("//button[text()='Submit']")    // Use text for buttons

// ❌ Avoid
$("div > div > span")              // Fragile structure-dependent
$x("//div[1]/div[2]/span[3]")      // Position-dependent XPath
```

### **Assertions**
```java
// ✅ Use Selenide conditions
element.shouldBe(visible);
element.shouldHave(text("Expected"));

// ❌ Avoid WebDriver assertions
Assert.assertTrue(element.isDisplayed()); // Less informative on failure
```

### **Page Objects**
```java
// ✅ Return page objects for chaining
public LoginPage enterCredentials(String user, String pass) {
    username.setValue(user);
    password.setValue(pass);
    return this;
}

public DashboardPage submit() {
    submitButton.click();
    return new DashboardPage();
}

// Usage
new LoginPage()
    .enterCredentials("user", "pass")
    .submit()
    .verifyDashboardLoaded();
```

### **Error Handling**
```java
// ✅ Handle expected conditions
try {
    element.shouldBe(visible, Duration.ofSeconds(5));
} catch (TimeoutException e) {
    // Handle gracefully
    logger.warn("Element not visible: " + e.getMessage());
}

// ✅ Use conditional logic
if (element.isDisplayed()) {
    element.click();
} else {
    logger.info("Element not visible, skipping action");
}
```

---

## 📚 **Quick Reference**

| Action | Selenide Method |
|--------|----------------|
| Find element | `$("#id")` or `$(".class")` |
| Find elements | `$$(".class")` |
| Click | `element.click()` |
| Type text | `element.setValue("text")` |
| Assert visible | `element.shouldBe(visible)` |
| Assert text | `element.shouldHave(text("text"))` |
| Wait for element | `element.waitUntil(visible, 5000)` |
| Take screenshot | `screenshot("name")` |
| Handle alert | `switchTo().alert().accept()` |
| Open page | `open("https://example.com")` |

## 🔗 **Useful Links**

- [Official Selenide Documentation](https://selenide.org/)
- [Selenide GitHub](https://github.com/selenide/selenide)
- [Selenide API Documentation](https://selenide.org/javadoc/current/)
- [Selenide Conditions Reference](https://selenide.org/documentation/selenide-api.html)