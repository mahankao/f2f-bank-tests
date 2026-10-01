import { APIRequestContext } from '@playwright/test'

export class UsersApi {
    private request: APIRequestContext

    constructor(request: APIRequestContext) {
        this.request = request
    }

    async getCurrentUser() {
        return await this.request.get('/api/users/current')
    }

    async getBalance() {
        return await this.request.get('/api/users/balance')
    }

    async addBalance(amount: number) {
        return await this.request.post('/api/users/balance/add', {
            data: {
                amount,
            },
        })
    }

    async getTransactions() {
        return await this.request.get('/api/users/transactions')
    }

    async transfer(phone: string, amount: number, purpose: string) {
        return await this.request.post('/api/users/transfer', {
            data: {
                phone,
                amount,
                purpose,
            },
        })
    }
}
