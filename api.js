class API {
    constructor() {
        this.ipv6 = '2001:4ca0:0:f27f:e803:d37b:cd47:3015'
        this.port = 8088
        this.version = 'v1'
        this.baseUrl = `http://[${this.ipv6}]:${this.port}/`
        this.apiUrl = `${this.baseUrl}${this.version}/`
    }

    signUp({ username, firstname, lastname, password }) {
        const urlPath = 'auth/signup'
        const url = this.baseUrl + urlPath

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, firstname, lastname, password })
        })
            .then(res => res.json())
            .catch(error => {
                console.error('SignUp::ERROR:', error)
                this.onInfoMessage('<b>SignUp::ERROR:</b> ' + error.toString(), 'error')
            })
    }

    signIn({ username, password }) {
        const urlPath = 'auth/signin'
        const url = this.baseUrl + urlPath

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(response => {
                this.username = username
                this.refreshToken = response.refreshToken
                this.accessToken = response.accessToken
                this.clientId = response.clientId
                this.expiresAt = new Date(Date.now() + response.expiresIn * 1000)

                return response
            })
            .catch(error => {
                console.error('SignIn::ERROR:', error)
                this.onInfoMessage('<b>SignIn::ERROR:</b> ' + error.toString(), 'error')
            })
    }

    users() {
        const urlPath = 'users'
        const url = this.apiUrl + urlPath

        return fetch(`${url}?token=${this.accessToken}`)
            .then(res => res.json())
            .catch(error => {
                console.error('Users::ERROR:', error)
                this.onInfoMessage('<b>Users::ERROR:</b> ' + error.toString(), 'error')
            })
    }

    userProfile({ gender, motto, university }) {
        const urlPath = `users/${this.username}`
        const url = this.apiUrl + urlPath

        return fetch(`${url}?token=${this.accessToken}`, {
            method: 'PATCH',
            body: JSON.stringify({
                username: this.username, gender, motto, university, token: this.accessToken
            })
        })
            .then(res => res.json())
            .catch(error => {
                console.error('Users::ERROR:', error)
                this.onInfoMessage('<b>UsersProfile::ERROR:</b> ' + error.toString(), 'error')
            })
    }
}