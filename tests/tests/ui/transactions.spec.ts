import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'

test.beforeEach(async ({ page, registerPage, loginPage }) => {
  const email = `transactions.${Date.now()}.${Math.floor(Math.random() * 9999)}@gmail.com`
  const password = 'password123'

  await registerPage.openRegisterPage()
  await registerPage.register('Maria', 'Ohotnikova', email, password)

  await expect(page).toHaveURL('/login')

  await loginPage.login(email, password)
  await expect(page).toHaveURL('/')
})



test('new user sees empty transactions list', async ({ transactionsPage }) => {
  await transactionsPage.openTransactionsPage()
  await transactionsPage.expectTransactionsTitle()
  await transactionsPage.expectEmptyTransactions()
})



test('user can add balance', async ({ transactionsPage }) => {
  await transactionsPage.openTransactionsPage()
  await transactionsPage.addBalance('5000')
  await transactionsPage.expectHeaderBalance('5000')
})



test('deposit transaction appears after adding balance', async ({ transactionsPage }) => {
  await transactionsPage.openTransactionsPage()
  await transactionsPage.addBalance('5000')

  await transactionsPage.expectTransactionText('deposit')
  await transactionsPage.expectTransactionText('completed')
  await transactionsPage.expectTransactionText('5000')
})



test('withdrawal transaction appears after transfer', async ({ transferPage, transactionsPage }) => {
  await transactionsPage.openTransactionsPage()
  await transactionsPage.addBalance('5000')

  await transferPage.openTransferPage()
  await transferPage.transfer('+79991234567', '100', 'test transfer')
  await transferPage.expectTransferCompleted()

  await transactionsPage.openTransactionsPage()

  await transactionsPage.expectTransactionText('withdrawal')
  await transactionsPage.expectTransactionText('completed')
  await transactionsPage.expectTransactionText('100')
})