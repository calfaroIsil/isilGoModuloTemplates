class Auth {
    constructor() {
        this.tokenKey = 'app_tk_isilgo';
    }

    setToken(token) {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2); // Token expira en 2 horas
        document.cookie = `${this.tokenKey}=${token}; expires=${expiration.toUTCString()}; path=/; secure; samesite=strict`;
    }

    getToken() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === this.tokenKey) {
                return value;
            }
        }
        return null;
    }

    removeToken() {
        document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

const auth = new Auth();
export default auth;
