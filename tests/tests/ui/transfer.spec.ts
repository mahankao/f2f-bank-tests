import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'

test.beforeEach(async ({ page, registerPage, loginPage }) => {
  const email = `transfer.${Date.now()}.${Math.floor(Math.random() * 9999)}@gmail.com`
  const password = 'password123'

  await registerPage.openRegisterPage()
  await registerPage.register('Maria', 'Ohotnikova', email, password)
  await expect(page).toHaveURL('/login')

  await loginPage.login(email, password)
  await expect(page).toHaveURL('/')
})



test('user can transfer money with enough balance', async ({ transferPage, transactionsPage }) => {
  await transactionsPage.openTransactionsPage()
  await transactionsPage.addBalance('5000')
  await transactionsPage.expectHeaderBalance('5000')

  await transferPage.openTransferPage()
  await transferPage.expectBalance('5000')

  await transferPage.transfer('+79991234567', '100', 'test transfer')

  await transferPage.expectTransferCompleted()
  await transferPage.expectBalance('4900')
})

test('user cannot transfer money without balance', async ({ transferPage }) => {
  await transferPage.expectBalance('0')

  await transferPage.transfer('+79991234567', '100', 'test transfer')

  await transferPage.expectSnackbar('Transfer failed. Check your balance.')
  await transferPage.expectBalance('0')
})

test('user cannot transfer money without phone', async ({ transferPage }) => {
  await transferPage.transfer('', '100', 'test transfer')

  await transferPage.expectPhoneError('Phone number is required')
})

test('user cannot transfer money if phone does not start with plus', async ({ transferPage }) => {
  await transferPage.transfer('79991234567', '100', 'test transfer')

  await transferPage.expectPhoneError('Must start with + and country code. Example: +7 999 123-45-67')
})

test('user cannot transfer money with short phone number', async ({ transferPage }) => {
  await transferPage.transfer('+7999', '100', 'test transfer')

  await transferPage.expectPhoneError('Phone must contain 10–15 digits')
})

test('user cannot transfer with empty form', async ({ transferPage }) => {
  await transferPage.transfer('', '', '')

  await transferPage.expectPhoneError('Phone number is required')
})

test('user cannot transfer negative amount', async ({ transferPage }) => {
    await transferPage.transfer('+79991234567', '-100', 'test transfer')

  await transferPage.expectSnackbar('Amount must be greater than zero')
})

test('user cannot transfer money without purpose', async ({ transferPage }) => {
  await transferPage.transfer('+79991234567', '100', '')

  await transferPage.expectPurposeFocused()
})
