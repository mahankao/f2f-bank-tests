import { Page, expect, Locator } from '@playwright/test'

export class RegisterPage {
    private page: Page
    private username: Locator
    private surname: Locator
    private email: Locator
    private password: Locator

    constructor(page: Page) {
        this.page = page
        this.username = this.page.getByPlaceholder('Type your name')
        this.surname = this.page.getByPlaceholder('Type your surname')
        this.email = this.page.locator('input[type="email"]')
        this.password = this.page.locator('input[type="password"]')
    }

    async openRegisterPage() {
        await this.page.goto('/register')
    }

    async register(username: string, surname: string, email: string, password: string) {
        await this.username.fill(username)
        await this.surname.fill(surname)
        await this.email.fill(email)
        await this.password.fill(password)
        await this.page.getByRole('button', { name: 'Register' }).click()
    }

    async expectNameFocused() {
        await expect(this.username).toBeFocused()
    }

    async expectSurnameFocused() {
        await expect(this.surname).toBeFocused()
    }

    async expectEmailFocused() {
        await expect(this.email).toBeFocused()
    }

    async expectPasswordFocused() {
        await expect(this.password).toBeFocused()
    }
}
