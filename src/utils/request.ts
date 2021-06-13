import Axios, { Method, AxiosRequestConfig } from 'axios';
import { navigate } from 'svelte-routing'

const BASE_URL = /intellidnd.com/i.test(location.host)
    ? 'https://api.intellidnd.com/v1'
    : 'http://localhost:4000/v1'
const axios = Axios.create({
    baseURL: BASE_URL,
});
axios.interceptors.response.use(res => res, (err) => {

    if (/Network Error/.test(err.message)) {

        navigate('/error');
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
