import { test as base } from '@playwright/test'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPage } from '../pages/LoginPage'
import { TransferPage } from '../pages/TransferPage'
import { TransactionsPage } from '../pages/TransactionsPage'

type MyFixtures = {
    registerPage: RegisterPage
    loginPage: LoginPage
    transferPage: TransferPage
    transactionsPage: TransactionsPage
}

export const test = base.extend<MyFixtures>({
    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page)
        await use(registerPage)
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await use(loginPage)
    },

    transferPage: async ({ page }, use) => {
        const transferPage = new TransferPage(page)
        await use(transferPage)
    },

    transactionsPage: async ({ page }, use) => {
        const transactionsPage = new TransactionsPage(page)
        await use(transactionsPage)
    },
})
