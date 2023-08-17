class Auth {
    constructor() {
        this.tokenKey = 'app_tk_isilgo';
        this.userKey = 'app_dt_isilgo';
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

    getUser() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === this.userKey) {
                return JSON.parse(value);
            }
        }
        return null;
    }


    setUser(user) {
        const userJSON = JSON.stringify(user);
        document.cookie = `${this.userKey}=${userJSON}; path=/; secure; samesite=strict`;
    }


    removeToken() {
        document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${this.userKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

const auth = new Auth();
export default auth;
