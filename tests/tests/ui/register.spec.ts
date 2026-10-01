import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'

test.beforeEach(async ({ registerPage }) => {
  await registerPage.openRegisterPage()
})



test('register with valid email', async ({ page, registerPage }) => {
  const validEmail = `register.${Date.now()}@gmail.com`

  await registerPage.register('Maria', 'Ohotnikova', validEmail, 'password123')
  await expect(page).toHaveURL('/login')
})



test('user cannot register 2 times with the same email', async ({ page, registerPage }) => {
  const duplicateEmail = `register.${Date.now()}@gmail.com`

  await registerPage.register('Maria', 'Ohotnikova', duplicateEmail, 'password123')
  await expect(page).toHaveURL('/login')

  await registerPage.openRegisterPage()
  await registerPage.register('Maria', 'Ohotnikova', duplicateEmail, 'password123')

  await expect(page.locator('.error')).toHaveText('User with this email already exists')
})



test('user cannot register with empty form', async ({ page, registerPage }) => {
  await registerPage.register('', '', '', '')
  await expect(page).toHaveURL('/register')
  await registerPage.expectNameFocused()
})



test('user cannot register without name', async ({ page, registerPage }) => {
  const email = `register.${Date.now()}@gmail.com`

  await registerPage.register('', 'Ohotnikova', email, 'password123')
  await expect(page).toHaveURL('/register')
  await registerPage.expectNameFocused()
})



test('user cannot register without surname', async ({ page, registerPage }) => {
  const email = `register.${Date.now()}@gmail.com`

  await registerPage.register('Maria', '', email, 'password123')
  await expect(page).toHaveURL('/register')
  await registerPage.expectSurnameFocused()
})



test('user cannot register without email', async ({ page, registerPage }) => {
    await registerPage.register('Maria', 'Ohotnikova', '', 'password123')
    await expect(page).toHaveURL('/register')
    await registerPage.expectEmailFocused()
})



test('user cannot register with incorrect email', async ({ page, registerPage }) => {
    const incorrectEmail = `register.${Date.now()}gmail.com`

    await registerPage.register('Maria', 'Ohotnikova', incorrectEmail, 'password123')
    await expect(page).toHaveURL('/register')
    await registerPage.expectEmailFocused()
})


test('user cannot register without password', async ({ page, registerPage }) => {
    const email = `register.${Date.now()}@gmail.com`

    await registerPage.register('Maria', 'Ohotnikova', email, '')
    await expect(page).toHaveURL('/register')
    await registerPage.expectPasswordFocused()
})
