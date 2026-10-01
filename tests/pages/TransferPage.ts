import { Page, expect, Locator } from '@playwright/test'

export class TransferPage {
    private page: Page
    private phoneNumber: Locator
    private amount: Locator
    private purpose: Locator

    constructor(page: Page) {
        this.page = page
        this.phoneNumber = this.page.locator('input[name="phone"]')
        this.amount = this.page.locator('input[name="amount"]')
        this.purpose = this.page.locator('input[name="purpose"]')
    }

    async openTransferPage() {
        await this.page.goto('/')
    }

    async transfer(phoneNumber: string, amount: string, purpose: string) {
        await this.phoneNumber.fill(phoneNumber)
        await this.amount.fill(amount)
        await this.purpose.fill(purpose)
        await this.page.getByRole('button', { name: 'Send' }).click()
    }

    async expectPurposeFocused() {
        await expect(this.purpose).toBeFocused()
    }

    async expectPhoneError(text: string) {
        await expect(this.page.locator('.field-error')).toHaveText(text)
    }

    async expectSnackbar(text: string) {
        await expect(this.page.getByText(text)).toBeVisible()
    }

    async expectTransferCompleted() {
        await expect(this.page.locator('.success-text')).toHaveText('Transfer completed')
    }

    async expectBalance(balance: string) {
        await expect(this.page.locator('.balance-hint')).toHaveText(`Balance: ${balance}`)
    }
}
