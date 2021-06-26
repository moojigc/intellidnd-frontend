import type { Character, CharacterStatic, Coins } from '../types';
import type { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { navigate } from 'svelte-routing';
import { writable, Writable } from 'svelte/store';
import getMap from '../utils/getMap';
import request from '../utils/request';
type Mode = 'dark' | 'light';
type Email = {
    address: string;
    verifiedAt?: number;
};
type Phone = {
    number: string;
    verifiedAt?: number;
}
interface UserAttributes {
    id: string;
    email?: string;
    phone?: string;
    name: string;
    token: string;
    expiresAt: number;
    accountVerifiedAt?: number;
    characters: Record<string, Character>;
    fetching?: boolean;
    notification?: string;
    inSync: boolean;
    mode: Mode;
    emails?: Email[];
    phones?: Phone[];
}

class User implements UserAttributes {

    public id: string;
    public name: string;
    public email?: string;
    public phone?: string;
    public token: string;
    public expiresAt: number;
    public accountVerifiedAt?: number;
    public characters: Record<string, Character>;
    public fetching = false;
    public notification?: string;
    public inSync = true;
    public mode: Mode = 'dark';
    public emails: Email[];
    public phones: Phone[];

    private _blank = {
        id: null,
        email: '',
        name: '',
        token: null,
        characters: {},
        expiresAt: null,
        fetching: false,
        inSync: true,
        mode: window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light' as Mode
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

            if (['token', 'fetching', 'notification'].includes(k)) { continue; }

            ls[k] = user[k];
        }

        localStorage.setItem('user', JSON.stringify(ls));
    }

    private async _getRefreshToken(throwError = false) {

        try {
                    
            const data = await request('/user/session/refresh', 'POST');

            this.set({
                token: data.token,
                expiresAt: data.expiresAt
            });

            return true;
        }
        catch (e) {

            if (e.response?.status === 401) {

                this.notify('Please login to continue.', 'error', true);
                this._clear();
                navigate('/login');
            }

            if (throwError) { throw e }
            else { return false }
        }
    }

    private async _publicRequest(target: string, method?: Method, options?: AxiosRequestConfig) {

        this.set({ fetching: true });

        try {

            return await request(target, method, null, options);
        }
        catch (e) {

            if (e.response.status == 429) {

                const reset = e.response.headers['x-ratelimit-reset'];
                const inMinutes = (reset - Math.floor(Date.now() / 1000)) / 60;
                switch (target) {
                    case '/user/login':
                        const id = options.data?.identifier;
                        this.notify(
                            `Login attempts exceeded. <a id="notif-link" href="/recover?id=${id}">Click here to reset password</a>.`,
                            'error',
                            false
                        );
                        break;
                    default:
                        this.notify(`You are doing that too many times! Please try again in ${inMinutes} minutes.`, 'error');
                }
            }
            throw e;
        }
        finally {

            this.set({ fetching: false });
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

            if (e.response) {

                if (e.response.status === 401 &&
                    ['auth-03', 'auth-01'].includes(e.response.data.code)
                ) {

                    const auth = await this._getRefreshToken(false);

                    if (auth) {

                        return this._request(target, method, options);
                    }
                }
                else if (e.response.status == 429) {
                    
                    const reset = e.response.headers['x-ratelimit-reset'];
                    const inMinutes = (reset - Math.floor(Date.now() / 1000)) / 60;
                    this.notify(`You are doing that too many times! Please try again in ${inMinutes} minutes.`, 'error');
                }
                else {
                    
                    throw e;
                }
            }
            else {

                throw e;
            }
        }
        finally {
            this.set({ fetching: false });
        }
    }

    private _initCharacters(chars: CharacterStatic[]) {

        if (!chars.length) {

            // @ts-ignore
            return [
                {
                    id: null,
                    race: null,
                    userId: this.id,
                    armorClass: 0,
                    charisma: 0,
                    constitution: 0,
                    dexterity: 0,
                    experience: 0,
                    hp: 0,
                    initiative: 0,
                    intelligence: 0,
                    level: 0,
                    maxHp: 0,
                    strength: 0,
                    wisdom: 0,
                    modifiedAt: null,
                    createdAt: null,
                    name: 'Character name',
                    update: async (options) => {

                        const res = await this._request(`/characters`, 'POST', {
                            data: options
                        });
        
                        return res;
                    },
                    inventory: {
                        id: null,
                        characterId: null,
                        wallet: {
                            copper: 0,
                            silver: 0,
                            gold: 0,
                            electrum: 0,
                            platinum: 0,
                            update: async (coins) => {
                                
                                const char = await this._request<Character>(`/characters`, 'POST', {
                                    data: {
                                        name: 'Character name'
                                    }
                                });

                                await this.getCharacters(char);

                                await this._request(`/characters/${char.id}/wallet`, 'PATCH', {
                                    data: coins
                                });

                                return coins;
                            },
                        }
                    }
                }
            ] as Character[];
        }

        const characters: Character[] = chars.map(char => ({
            ...char,
            update: async (options) => {
                
                const res = await this._request(`/characters/${char.id}`, 'PATCH', {
                    data: options
                });

                return res;
            },
            delete: async () => {

                await this._request(`/characters/${char.id}`, 'DELETE');
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

                        for (const c in coins) {

                            char.inventory.wallet[c] = coins[c];
                        }

                        await this._request(`/characters/${char.id}/wallet`, 'PATCH', {
                            data: coins
                        });

                        await this.getCharacters(char);

                        return char.inventory.wallet;
                    },
                    getTotalAs: (type?: keyof Coins) => {

                        const {
                            gold,
                            copper,
                            electrum,
                            platinum,
                            silver
                        } = char.inventory.wallet;

                        const asGold = gold + 
                            (copper / 100) +
                            (electrum / 2) +
                            (platinum * 10) +
                            (silver / 10);

                        switch (type) {
                            case 'copper':
                                return asGold * 100;
                            case 'electrum':
                                return asGold * 2;
                            case 'platinum':
                                return asGold / 10;
                            case 'silver':
                                return asGold * 10;
                            default:
                                return asGold;
                        }
                    }
                }
            }
        }));

        return characters;
    }

    public notify(message: string, type: 'error' | 'warning' | 'success', autoDismiss = true) {

        this.set({
            notification: `${type}|${message}`
        });

        if (autoDismiss) {

            setTimeout(() => {
                console.log('dismissed')
                this.set({
                    notification: null
                });
            }, 5000);
        }
    }

    public async signup(details: {
        email: string;
        password: string;
        verify: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        phone?: string;
    }) {

        const res = await this._publicRequest('/user/signup', 'POST', {
            data: details
        });

        this.set(res);
    }

    public async login(identifier: string, password: string) {

        const user = await this._publicRequest('/user/login', 'POST', {
            data: {
                identifier, password
            }
        });

        this.set(user);
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

    public async getCharacters(updates?: Partial<CharacterStatic>) {

        if (updates) {

            if (updates.id in this.characters) {

                for (const k in updates) {

                    this.characters[updates.id][k] = updates[k];
                }
            }
        }

        let chars: CharacterStatic[] = Object.values(this.characters || {});

        if (!updates) {

            chars = await this._request<CharacterStatic[]>('/characters')
        }

        chars && this.set({ characters: getMap(this._initCharacters(chars), 'id') });
    }

    public async verifyPhone(phone: string, code: string) {
        await this._request(`/user/phone/${phone}/verify`, 'PATCH', {
            data: {
                code,
            }
        });
        await this._getRefreshToken();
    }

    public async verifyEmail(email: string, code: string) {
        await this._request(`/user/email/${encodeURIComponent(email)}/verify`, 'PATCH', {
            data: {
                code,
            }
        });
        await this._getRefreshToken();
    }

    public async discordLogin(code: string) {
        const res = await this._publicRequest('/user/oauth/discord', 'POST', {
            data: {
                code
            }
        });
        this.set(res);
        return this;
    }

    public async recover(identifier: string) {
        return await this._publicRequest('/user/recover', 'POST', {
            data: {
                identifier
            }
        });
    }

    public async resendPhoneCode(phone: string) {
        return await this._request(`/user/phone/${phone}/send`, 'POST');
    }

    public async resendEmailCode(email: string) {
        return await this._request(`/user/email/${encodeURIComponent(email)}`, 'POST');
    }

    public async addPhone(phone: string) {
        return await this._request(`/user/phone`, 'POST', {
            data: {
                phone
            }
        });
    }
}

export const user = new User();
export default user;