import type { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { writable, Writable } from 'svelte/store';
import getMap from '../utils/getMap';
import request from '../utils/request';

interface UserAttributes {
    email: string;
    name: string;
    token: string;
    expiresAt: number;
    characters?: Record<string, any>;
    fetching?: boolean;
    isLoggedOut?: boolean;
}

class User implements UserAttributes {

    public name: string;
    public email: string;
    public token: string;
    public expiresAt: number;
    public characters?: Record<string, any>;
    public fetching = false;
    public isLoggedOut?: boolean;

    public subscribe: Writable<UserAttributes>['subscribe'];
    public set(values: Partial<UserAttributes>) {

        for (const k in values) {

            this[k] = values[k];
            this._set(k as keyof UserAttributes, values[k]);
        }
    }

    constructor() {

        const { subscribe, update } = writable({
            email: '',
            name: '',
            token: '',
            expiresAt: 0,
            fetching: false,
        });
    
        this.subscribe = subscribe;
        this._update = update;

        this._init();
    }

    private _init() {

        const ls = this._getLs();
        this.set(ls);

        if (!ls.name) {

            this._set('isLoggedOut', true);
        }
    }

    private _getLs(): Partial<UserAttributes> {

        return JSON.parse(localStorage.getItem('user') || '{}');
    }
    private _setLs(user: Partial<UserAttributes>) {

        const existing = this._getLs();
        const data = {
            ...existing,
            ...user
        };
        delete data.token;
        localStorage.setItem('user', JSON.stringify(data));
    }

    private _update: Writable<UserAttributes>['update'];
    private _set(field: string, value: UserAttributes[keyof UserAttributes]) {

        this[field] = value;
        this._update(user => {
            
            user[field] = value;

            this._setLs(user);
            
            return user;
        });
    }
    private async _getRefreshToken() {

        try {
                    
            const data = await request('/user/session/refresh', 'POST');

            this._set('token', data.token);
            this._set('expiresAt', data.expiresAt);
        }
        catch (e) {

            if (e.response?.status === 401) {

                location.replace('/login');
            }
        }
    }

    private async _request<T = any>(target: string, method?: Method, options?: AxiosRequestConfig): Promise<T> {

        this.set({ fetching: true });
        
        try {

            if (!this.token || this.expiresAt <= Date.now()) {

                await this._getRefreshToken();
            }

            return await request(target, method, this.token, options);
        }
        catch (e) {

            if ('response' in e) {

                if (e.response.status === 401) {

                    try {
                        console.log('getting refresh token')
                        await this._getRefreshToken();
                    }
                    catch (e) {

                        const errorBox = document.getElementById('error-box');
                        errorBox.innerText = e.response?.data.message || e.message;
                        errorBox.hidden = false;
                        throw e;
                    }

                    return this._request(target, method, options);
                }
                else {

                    const errorBox = document.getElementById('error-box');
                    errorBox.innerText = e.response?.data.message || e.message;
                    errorBox.hidden = false;
                    throw e;
                }
            }
        }
        finally {

            this.set({ fetching: false });
        }
    }

    public async login(identifier: string, password: string) {

        const user = await request('/user/login', 'POST', null, {
            data: {
                identifier, password
            }
        });

        this.set(user);
        this.set({ isLoggedOut: false });
    }

    public async logout() {

        await this._request('/user/logout', 'POST');

        this.set({ isLoggedOut: true, token: null });
    }

    public async getProfile() {

        const profile = await this._request('/user/profile');

        this.set(profile);
    }

    public async getCharacters() {

        const chars = await this._request<any[]>('/characters');

        this.set({ characters: getMap(chars, 'id') })
    }
}

export const user = new User();
export default user;