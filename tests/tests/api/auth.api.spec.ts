import { expect, test } from '@playwright/test'
import { AuthApi } from '../../api/AuthApi'

test('user can register by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const email = `register.api.${Date.now()}@gmail.com`

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, 'password123')
  expect(registerResponse.status()).toBe(201)

  const registerBody = await registerResponse.json()

  expect(registerBody.name).toBe('Maria')
  expect(registerBody.surname).toBe('Ohotnikova')
  expect(registerBody.email).toBe(email)
  expect(registerBody.role).toBe('user')
})



test('user cannot register 2 times with same email by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const email = `duplicate.api.${Date.now()}@gmail.com`

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, 'password123')
  expect(registerResponse.status()).toBe(201)

  const duplicateResponse = await authApi.register('Maria', 'Ohotnikova', email, 'password123')
  expect(duplicateResponse.status()).toBe(400)

  const duplicateBody = await duplicateResponse.json()
  expect(duplicateBody.detail).toBe('User with this email already exists')
})



test('user can login by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const email = `login.api.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  expect(loginBody.token).toBeTruthy()
})



test('user cannot login with incorrect password by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const email = `wrong.password.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, 'wrongPassword')
  expect(loginResponse.status()).toBe(401)

  const loginBody = await loginResponse.json()
  expect(loginBody.detail).toBe('Invalid email or password')
})



test('user cannot login with not exist email by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const email = `not.exist.${Date.now()}@gmail.com`

  const loginResponse = await authApi.login(email, 'password123')
  expect(loginResponse.status()).toBe(401)

  const loginBody = await loginResponse.json()
  expect(loginBody.detail).toBe('Invalid email or password')
})



test('user cannot register without email by api', async ({ request }) => {
      const registerResponse = await request.post('/api/auth/register', {
    data: {
      name: 'Maria',
      surname: 'Ohotnikova',
      password: 'password123',
    },
  })
  expect(registerResponse.status()).toBe(422)

  const registerBody = await registerResponse.json()
  expect(registerBody.detail[0].loc).toContain('email')
})
