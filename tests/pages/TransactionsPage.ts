import { Page, expect } from '@playwright/test'

export class TransactionsPage {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async openTransactionsPage() {
        await this.page.goto('/transactions')
    }

    async addBalance(amount: string) {
        await this.page.getByRole('button', { name: 'Add balance' }).click()
        await this.page.locator('input[type="number"]').fill(amount)
        await this.page.getByRole('button', { name: 'Add', exact: true }).click()
    }

    async expectHeaderBalance(balance: string) {
        await expect(this.page.getByRole('heading', { name: `Balance: ${balance}` })).toBeVisible()
    }

    async expectTransactionsTitle() {
        await expect(this.page.getByRole('heading', { name: 'Transactions' })).toBeVisible()
    }

    async expectEmptyTransactions() {
        await expect(this.page.getByText('No transactions yet')).toBeVisible()
    }

    async expectTransactionText(text: string) {
        await expect(this.page.getByRole('cell', { name: text, exact: true }).first()).toBeVisible()
    }
}
