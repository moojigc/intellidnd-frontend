import type { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { writable, Writable } from 'svelte/store';
import type { Character, CharacterStatic } from '../types';
import getMap from '../utils/getMap';
import request from '../utils/request';

interface UserAttributes {
    id: string;
    email: string;
    name: string;
    token: string;
    expiresAt: number;
    characters: Record<string, Character>;
    fetching?: boolean;
}

class User implements UserAttributes {

    public id: string;
    public name: string;
    public email: string;
    public token: string;
    public expiresAt: number;
    public characters: Record<string, Character>;
    public fetching = false;

    private _blank = {
        id: null,
        email: '',
        name: '',
        token: null,
        characters: {},
        expiresAt: null,
        fetching: false
    };

    public subscribe: Writable<Partial<UserAttributes>>['subscribe'];
    public set(values: Partial<UserAttributes>) {

        for (const k in values) {

            this[k] = values[k];

            this._set(this);
        }

        this._setLs(values);
    }

    constructor() {

        const { subscribe, set } = writable(this._getLs() || {} as UserAttributes);
    
        this.subscribe = subscribe;

        this._set = set;
        this._clear = () => {

            this.set(this._blank);
        }
        this._init();
    }

    private _set: Writable<UserAttributes | {}>['set'];

    private _init() {

        const ls = this._getLs();

        if (!ls) {

            this.set(this._blank);
        }
        else {
            
            this.set({
                ...ls,
                fetching: false
            });
        }

    }

    private _clear: () => void;

    private _getLs(): Partial<UserAttributes> | null {

        const string = localStorage.getItem('user');
        return string ? JSON.parse(string || '{}') : null;
    }
    private _setLs(user: Partial<UserAttributes>) {

        const ls = this._getLs() || {};
        
        for (const k in user) {

            if (['token', 'fetching'].includes(k)) { continue; }

            ls[k] = user[k];
        }

        localStorage.setItem('user', JSON.stringify(ls));
    }

    private async _getRefreshToken() {

        try {
                    
            const data = await request('/user/session/refresh', 'POST');

            this.set({
                token: data.token,
                expiresAt: data.expiresAt
            });
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

                if (!e.response || e.response.status === 500) {

                    location.assign('/error');
                }
                else if (e.response.status === 401) {

                    try {

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

    private _initCharacters(chars: CharacterStatic[]) {

        const characters: Character[] = chars.map(char => ({
            ...char,
            update: async (options) => {
                
                const res = await this._request(`/characters/${char.id}`, 'PATCH', {
                    data: options
                });

                return res;
            },
            inventory: {
                ...char.inventory,
                addItem: async (item) => {

                    return await this._request(`/characters/${char.id}/inventory`, 'POST', {
                        data: item
                    });
                },
                removeItem: async (itemId) => {

                    await this._request(`/characters/${char.id}/inventory/${itemId}`, 'DELETE');
                },
                updateItem: async (itemId, item) => {

                    return await this._request(`/characters/${char.id}/inventory/${itemId}`, 'PATCH', {
                        data: item
                    });
                },
                wallet: {
                    ...char.inventory.wallet,
                    update: async (coins) => {

                        return await this._request(`/characters/${char.id}/wallet`, 'PATCH', {
                            data: coins
                        });
                    },
                }
            }
        }));

        return characters;
    }

    public async login(identifier: string, password: string) {

        this.set({ fetching: true });

        try {

            const user = await request('/user/login', 'POST', null, {
                data: {
                    identifier, password
                }
            });
            this.set(user);
        }
        catch (e) {

            throw e;
        }
        finally {

            this.set({ fetching: false });
        }

    }

    public async logout() {

        this.set({ fetching: true });

        try {

            await request('/user/logout', 'POST', this.token);
        }
        catch (e) {}
        finally {
            
            this._clear();
            localStorage.removeItem('user');
        }
    }

    public async getProfile() {

        const profile = await this._request('/user/profile');

        this.set(profile);
    }

    public async getCharacters() {

        const chars = await this._request<any[]>('/characters');

        this.set({ characters: getMap(this._initCharacters(chars), 'id') })
    }
}

export const user = new User();
export default user;