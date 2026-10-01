import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'

test.beforeEach(async ({ loginPage }) => {
  await loginPage.openLoginPage()
})



test('login with valid email', async ({ page, loginPage, registerPage }) => {
  const email = `login.${Date.now()}@gmail.com`
  const password = 'password123'

  await registerPage.openRegisterPage()
  await registerPage.register('Maria', 'Ohotnikova', email, password)
  await expect(page).toHaveURL('/login')

  await loginPage.login(email, password)

  await expect(page).toHaveURL('/')
})



test('user cannot login with empty form', async ({ page, loginPage }) => {
  await loginPage.login('', '')
  await expect(page).toHaveURL('/login')
  await loginPage.expectEmailFocused()
})



test('user cannot login without email', async ({ page, loginPage }) => {
  await loginPage.login('', 'password123')
  await expect(page).toHaveURL('/login')
  await loginPage.expectEmailFocused()
})



test('user cannot login with incorrect email', async ({ page, loginPage }) => {
  const incorrectEmail = `login.${Date.now()}gmail.com`
  await loginPage.login(incorrectEmail, 'password123')
  await expect(page).toHaveURL('/login')
  await loginPage.expectEmailFocused()
})



test('user cannot login without password', async ({ page, loginPage }) => {
  const email = `login.${Date.now()}@gmail.com`
  await loginPage.login(email, '')
  await expect(page).toHaveURL('/login')
  await loginPage.expectPasswordFocused()
})
