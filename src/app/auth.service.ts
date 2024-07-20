import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

interface TokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string,
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    protected authorization: string | undefined;
    protected expirationTimestamp = 0;

    constructor() {
        try {
            this.loadFromLocalStorage();
        } catch (e) {
            console.log('Clearing localStorage: ', (e as Error)?.message)
            localStorage.clear(); // clear state if invalid
        }
    }

    protected loadFromLocalStorage() {
        const token = localStorage.getItem('auth');
        const expirationStr = localStorage.getItem('auth_expr');

        if (token === null || expirationStr === null) return;

        const expiration = Number(expirationStr);

        if (Number.isNaN(expiration)) {
            throw new Error("Invalid expiration");
        }
        if (expiration <= Date.now()) {
            throw new Error("Token expired");
        }

        this.authorization = token;
        this.expirationTimestamp = expiration;
    }

    protected updateLocalStorage() {
        if (!this.authorization) {
            localStorage.clear();
            return;
        }

        localStorage.setItem('auth', this.authorization);
        localStorage.setItem('auth_expr', this.expirationTimestamp.toString());
    }


    public async authenticate(client_id: string, client_secret: string): Promise<boolean> {
        const reqTimestamp = Date.now();

        const tokenRes = await fetch(`${environment.authUrl}/connect/token`, {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id,
                client_secret,
                scope: 'api',
            })
        });

        if (!tokenRes.ok) return false;

        const { access_token, expires_in, token_type } = await tokenRes.json() as TokenResponse;

        //set state
        this.expirationTimestamp = reqTimestamp + 1000 * expires_in;
        this.authorization = `${token_type} ${access_token}`;

        //store token
        this.updateLocalStorage();

        return true;
    }

    public clear() {
        this.authorization = undefined;
        this.expirationTimestamp = 0;
        this.updateLocalStorage();
    }

    public get Authorization() {
        if (!this.authorization) return undefined;
        if (this.expirationTimestamp <= Date.now()) return undefined;

        return this.authorization;
    }

    public get Authorized() {
        return (!!this.authorization) && (this.expirationTimestamp > Date.now());
    }

    public get SessionEnd() {
        return this.authorization ?
            new Date(this.expirationTimestamp).toLocaleTimeString() :
            'No session';
    }
}
