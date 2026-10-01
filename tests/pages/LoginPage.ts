import { Page, expect, Locator } from '@playwright/test'

export class LoginPage {
    private page: Page
    private email: Locator
    private password: Locator

    constructor(page: Page) {
        this.page = page
        this.email = this.page.locator('input[type="email"]')
        this.password = this.page.locator('input[type="password"]')
    }

    async openLoginPage() {
        await this.page.goto('/login')
    }

    async login(email: string, password: string) {
        await this.email.fill(email)
        await this.password.fill(password)
        await this.page.getByRole('button', { name: 'Login' }).click()
    }

    async expectEmailFocused() {
        await expect(this.email).toBeFocused()
    }

    async expectPasswordFocused() {
        await expect(this.password).toBeFocused()
    }
}
