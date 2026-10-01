import { expect, test } from '@playwright/test'
import { AuthApi } from '../../api/AuthApi'
import { UsersApi } from '../../api/UsersApi'

test('user can get current user by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `users.api.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const currentUserResponse = await usersApi.getCurrentUser()
  expect(currentUserResponse.status()).toBe(200)

  const currentUserBody = await currentUserResponse.json()
  expect(currentUserBody.email).toBe(email)
  expect(currentUserBody.name).toBe('Maria')
  expect(currentUserBody.surname).toBe('Ohotnikova')
  expect(currentUserBody.role).toBe('user')
})



test('new user has zero balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `balance.api.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const balanceResponse = await usersApi.getBalance()
  expect(balanceResponse.status()).toBe(200)

  const balanceBody = await balanceResponse.json()
  expect(balanceBody.amount).toBe(0)
})



test('user can add balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `add.balance.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const addBalanceResponse = await usersApi.addBalance(3000)
  expect(addBalanceResponse.status()).toBe(200)

  const addBalanceBody = await addBalanceResponse.json()
  expect(addBalanceBody.result).toBe('ok')

  const balanceResponse = await usersApi.getBalance()
  expect(balanceResponse.status()).toBe(200)

  const balanceBody = await balanceResponse.json()
  expect(balanceBody.amount).toBe(3000)
})



test('user cannot add negative balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `negative.balance.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const addBalanceResponse = await usersApi.addBalance(-100)
  expect(addBalanceResponse.status()).toBe(400)

  const addBalanceBody = await addBalanceResponse.json()
  expect(addBalanceBody.detail).toBe('Amount must be greater than zero')
})



test('new user has empty transactions by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `empty.transactions.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const transactionsResponse = await usersApi.getTransactions()
  expect(transactionsResponse.status()).toBe(200)

  const transactionsBody = await transactionsResponse.json()
  expect(transactionsBody).toEqual([])
})



test('deposit transaction appears after adding balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `deposit.transaction.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const addBalanceResponse = await usersApi.addBalance(3000)
  expect(addBalanceResponse.status()).toBe(200)

  const transactionsResponse = await usersApi.getTransactions()
  expect(transactionsResponse.status()).toBe(200)

  const transactionsBody = await transactionsResponse.json()
  expect(transactionsBody[0].amount).toBe(3000)
  expect(transactionsBody[0].transaction_type).toBe('deposit')
  expect(transactionsBody[0].transaction_status).toBe('completed')
})



test('user can transfer money with enough balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `transfer.success.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const addBalanceResponse = await usersApi.addBalance(3000)
  expect(addBalanceResponse.status()).toBe(200)

  const transferResponse = await usersApi.transfer('+79991234567', 100, 'test transfer')
  expect(transferResponse.status()).toBe(200)

  const transferBody = await transferResponse.json()
  expect(transferBody.result).toBe('ok')

  const balanceResponse = await usersApi.getBalance()
  expect(balanceResponse.status()).toBe(200)

  const balanceBody = await balanceResponse.json()
  expect(balanceBody.amount).toBe(2900)
})



test('user cannot transfer money without balance by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `transfer.no.balance.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const transferResponse = await usersApi.transfer('+79991234567', 100, 'test transfer')
  expect(transferResponse.status()).toBe(400)

  const transferBody = await transferResponse.json()
  expect(transferBody.detail).toBe('Insufficient funds')
})



test('user cannot transfer money with invalid phone by api', async ({ request }) => {
  const authApi = new AuthApi(request)
  const usersApi = new UsersApi(request)

  const email = `invalid.phone.${Date.now()}@gmail.com`
  const password = 'password123'

  const registerResponse = await authApi.register('Maria', 'Ohotnikova', email, password)
  expect(registerResponse.status()).toBe(201)

  const loginResponse = await authApi.login(email, password)
  expect(loginResponse.status()).toBe(200)

  const addBalanceResponse = await usersApi.addBalance(3000)
  expect(addBalanceResponse.status()).toBe(200)

  const transferResponse = await usersApi.transfer('79991234567', 100, 'test transfer')
  expect(transferResponse.status()).toBe(400)

  const transferBody = await transferResponse.json()
  expect(transferBody.detail).toBe('Invalid phone number format')
})
