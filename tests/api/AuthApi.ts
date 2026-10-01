import { APIRequestContext } from '@playwright/test'

export class AuthApi {
    private request: APIRequestContext

    constructor(request: APIRequestContext) {
        this.request = request
    }

    async register(name: string, surname: string, email: string, password: string) {
        return await this.request.post('/api/auth/register', {
            data: {
                name,
                surname,
                email,
                password,
            },
        })
    }

    async login(email: string, password: string) {
        return await this.request.post('/api/auth/login', {
            data: {
                email,
                password,
            },
        })
    }
}
