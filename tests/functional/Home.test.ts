import test from "@lib/BaseTest"
import { HomePage } from "@pages/HomePage"
import HomeData from "@data/HomePageData.json"
import {expect,request} from "@playwright/test"

const loginPayload = {
    userEmail: "anshika@gmail.com", userPassword: "Iamking@000"
}
let token: string

test.describe("Test Home page features", async () => {
    test.beforeAll(async () => {
        const apiContext = await request.newContext()
        const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login/", {
            data: loginPayload
        })
        const loginResponseJson = await loginResponse.json()
        token = loginResponseJson.token
        console.log(token)
    })

    test.beforeEach(async ({ page }) => {
        page.addInitScript(value => {
            window.localStorage.setItem("token", value)
        }, token)
        await page.goto("https://rahulshettyacademy.com/client")
    })

    test("Verify Filter Search input is working properly or not for valid data", async ({ homePage }) => {
        await homePage.searchProduct(HomeData.ValidProductName)
        let product =await homePage.getProductName()
        console.log(product)
        expect(product.toLowerCase()).toContain(HomeData.ValidProductName)
    })

    for (const data of HomeData.InvalidProductName){
        test(`Verify Filter Search input is working properly or not for invalid ${data.Product} data`, async ({ homePage }) => {
            await homePage.searchProduct(data.Product)
            expect(await homePage.getErrorToastMsg()).toBe(HomeData.ErrorMessage)
        })
    }


    test.only("Verify Price Range is working properly or not for valid data", async ({ homePage }) => {
        await homePage.setMinimumAndMaxPriceRange(HomeData.ValidPriceRange.Mini, HomeData.ValidPriceRange.Max)
        //console.log(await homePage.getRangeProductName())
        expect(await homePage.getRangeProductName()).toContain(HomeData.ValidRangeProductName)
      
    })

    test("Verify Price Range is working properly or not for invalid data", async ({ homePage }) => {
        await homePage.setMinimumAndMaxPriceRange(HomeData.InvalidPriceRange.Mini, HomeData.InvalidPriceRange.Max)
        expect(await homePage.getErrorToastMsg()).toBe(HomeData.ErrorMessage)
    })

})

