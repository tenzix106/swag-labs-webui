package utility;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class BrowserDriver {

    public static WebDriver driver;

    public static void initDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        // options.addArguments("--headless=new"); // uncomment when running on Jenkins

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }

    public static WebDriver getDriver() {
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}