package data;

public class TestData {

    public static final String BASE_URL = "https://www.demoblaze.com/index.html";

    public static class Products {
        public static final String SAMSUNG_GALAXY_S6 = "Samsung galaxy s6";
        public static final String NOKIA_LUMIA = "Nokia lumia 1520";
        public static final String NEXUS = "Nexus 6";
        public static final String SAMSUNG_GALAXY_S7 = "Samsung galaxy s7";
        public static final String IPHONE_6_32GB = "Iphone 6 32gb";
        public static final String SONY_XPERIA_Z5 = "Sony xperia z5";
    }

    public static class Categories {
        public static final String PHONES = "Phones";
        public static final String LAPTOPS = "Laptops";
        public static final String MONITORS = "Monitors";
    }

    public static class NavigationLinks {
        public static final String HOME = "Home (current)";
        public static final String CONTACT = "Contact";
        public static final String ABOUT_US = "About us";
        public static final String CART = "Cart";
        public static final String LOGIN = "Log in";
        public static final String SIGN_UP = "Sign up";
        public static final String PRODUCT_STORE = "PRODUCT STORE";
        public static final String CATEGORIES = "CATEGORIES";
    }

    public static class Prices {
        public static final String SAMSUNG_GALAXY_S6_PRICE = "$360";
        public static final String NOKIA_LUMIA_PRICE = "$820";
        public static final String NEXUS_PRICE = "$650";
        public static final String SAMSUNG_GALAXY_S7_PRICE = "$800";
        public static final String IPHONE_6_32GB_PRICE = "$790";
        public static final String SONY_XPERIA_Z5_PRICE = "$320";
    }

    public static class PricesWithTax {
        public static final String SAMSUNG_GALAXY_S6_PRICE_WITH_TAX = "$360 *includes tax";
        public static final String NOKIA_LUMIA_PRICE_WITH_TAX = "$820 *includes tax";
        public static final String NEXUS_PRICE_WITH_TAX = "$650 *includes tax";
    }

    public static class ProductDescriptions {
        public static final String SAMSUNG_GALAXY_S6_DESCRIPTION = "The Samsung Galaxy S6 is";
        public static final String NOKIA_LUMIA_DESCRIPTION = "The Nokia Lumia 1520 is";
        public static final String NEXUS_DESCRIPTION = "The Motorola Google Nexus 6";
        public static final String SAMSUNG_GALAXY_S7_DESCRIPTION = "The Samsung Galaxy S7 is";
        public static final String IPHONE_6_32GB_DESCRIPTION = "It comes with 1GB of RAM. The";
        public static final String SONY_XPERIA_Z5_DESCRIPTION = "Sony Xperia Z5 Dual";
    }

    public static class CartTableHeaders {
        public static final String PIC = "Pic";
        public static final String TITLE = "Title";
        public static final String PRICE = "Price";
        public static final String X = "x";
    }

    public static class FooterText {
        public static final String COPYRIGHT = "Copyright © Product Store";
        public static final String ABOUT_US_HEADING = "About Us";
        public static final String GET_IN_TOUCH_HEADING = "Get in Touch";
    }

    public static class PageHeadings {
        public static final String PRODUCTS = "Products";
        public static final String TOTAL = "Total";
    }

    public static class Buttons {
        public static final String ADD_TO_CART = "Add to cart";
        public static final String PLACE_ORDER = "Place Order";
        public static final String DELETE = "Delete";
        public static final String PREVIOUS = "Previous";
        public static final String NEXT = "Next";
    }

    public static class ContactFormData {
        public static final String VALID_EMAIL = "test@example.com";
        public static final String VALID_NAME = "Test User";
        public static final String VALID_MESSAGE = "This is a test message";
        public static final String ANOTHER_VALID_EMAIL = "emmanuel@example.com";
        public static final String ANOTHER_VALID_NAME = "Emmanuel Arhu";
        public static final String ANOTHER_VALID_MESSAGE = "This is a Selenide test please ignore";
        public static final String INVALID_DATA_PATTERN = "1234567890-";
    }

    public static class OrderFormData {
        public static final String VALID_NAME = "Emmanuel Arhu";
        public static final String VALID_COUNTRY = "Ghana";
        public static final String VALID_CITY = "Takoradi";
        public static final String VALID_CREDIT_CARD = "123456789";
        public static final String VALID_MONTH = "12";
        public static final String VALID_YEAR = "2030";
        public static final String TEST_NAME = "Test User";
        public static final String TEST_COUNTRY = "Test Country";
        public static final String INVALID_DATA_PATTERN = "1234567890-";
    }

    public static class Timeouts {
        public static final int DEFAULT_WAIT_MS = 1000;
        public static final int ALERT_WAIT_MS = 1000;
        public static final int MODAL_WAIT_MS = 1000;
    }

    public static class TestValues {
        public static final String SAMPLE_PRICE = "360";
        public static final String COPYRIGHT_YEAR = "2017";
        public static final String FULL_COPYRIGHT = "Copyright © Product Store 2017";
    }

    public static class Selectors {
        public static class Common {
            public static final String HOME_LINK = "li[class='nav-item active'] a[class='nav-link']";
            public static final String PRICE_CONTAINER = ".price-container";
            public static final String PRODUCT_NAME = ".name";
            public static final String CARD_TITLE = ".card-title";
        }

        public static class Cart {
            public static final String DELETE_BUTTON_XPATH = "//a[text()='Delete']";
            public static final String PRODUCT_IN_CART_XPATH = "//td[normalize-space()='%s']";
            public static final String PRODUCT_PRICE_XPATH = "//td[text()='%s']";
        }

        public static class Buttons {
            public static final String PURCHASE_BUTTON_XPATH = "//button[text()='Purchase']";
            public static final String PLACE_ORDER_BUTTON_XPATH = "//button[text()='Place Order']";
            public static final String CONFIRM_BUTTON = ".confirm.btn.btn-lg.btn-primary";
        }

        public static class Messages {
            public static final String THANK_YOU_PURCHASE = "//h2[text()='Thank you for your purchase!']";
        }
    }

    public static class AlertMessages {
        public static final String PRODUCT_ADDED = "Product added";
        public static final String EMAIL_REQUIRED = "Please fill out Email.";
        public static final String NAME_REQUIRED = "Please fill out Name.";
        public static final String MESSAGE_REQUIRED = "Please fill out Message.";
    }
}