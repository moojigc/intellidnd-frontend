import Axios, { Method, AxiosRequestConfig } from 'axios';
import { navigate } from 'svelte-routing'

const BASE_URL = /intellidnd.com/i.test(location.host)
    ? 'https://api.intellidnd.com/v1'
    : 'http://localhost:4000/v1'
const axios = Axios.create({
    // @ts-ignore
    baseURL: window.API_URL || BASE_URL,
});

const sleep = () => new Promise((resolve, _) => setTimeout(resolve, 30000));
const _ping = async () => {

    let ok = false;
    let reattempts = 0;

    while (!ok && reattempts <= 5) {

        const res = await fetch('/ping');
        if (res.status >= 200 && res.status < 300) {

            ok = true;
        }
        else {

            reattempts ++;
            console.log(reattempts)
            await sleep();
        }
    }
}

axios.interceptors.response.use(null, (err) => {

    if (/Network Error/.test(err.message)) {

        navigate('/error');
        _ping();
    }
    else if (err.response?.status === 500) {

        navigate('/error/server');
    }
    else {

        return Promise.reject(err);
    }
});

export default async function request(
	target: string,
	method: Method = 'GET',
    token?: string,
	options: AxiosRequestConfig = {}
) {
    try {

        const res = await axios({
            url: target,
            method: method,
            headers: token
                ? {
                    Authorization: `Bearer ${token}`
                    }
                : {},
            withCredentials: true,
            ...options
        });

        return res?.data;
    }
    catch (e) {

        if (e.response) {

            switch (e.response.status) {
                case 500:
                    navigate('/error');
                default:
                    throw e;
            }
        }
        throw e;
    }
}
