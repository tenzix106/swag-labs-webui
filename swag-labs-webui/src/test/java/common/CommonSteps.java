package common;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import utility.BrowserDriver;

import java.time.Duration;

public class CommonSteps {

    protected WebDriver driver;
    protected WebDriverWait wait;

    public CommonSteps() {
        this.driver = BrowserDriver.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void click(By locator){
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    public void type(By locator, String text){
        WebElement element = wait.until(ExpectedConditions.visibilityOfElementLocated(locator));

        element.clear();
        element.sendKeys();
    }

    public String getText(By locator){
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText();
    }

    public boolean isDisplayed(By locator){
        return !driver.findElements(locator).isEmpty() && driver.findElement(locator).isDisplayed();
    }

    public void waitForUrlContains(String partialUrl){
        wait.until(ExpectedConditions.urlContains(partialUrl));
    }

    public void navigateTo(String url){
        driver.get(url);
    }
}
