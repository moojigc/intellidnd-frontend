import axios, { Method, AxiosRequestConfig, AxiosError } from 'axios';
import { navigate } from 'svelte-routing'

const BASE_URL = /intellidnd.com/i.test(location.host)
    ? 'https://api.intellidnd.com/v1'
    : 'http://localhost:4000/v1'

export default async function request(
	target: string,
	method: Method = 'GET',
    token?: string,
	options: AxiosRequestConfig = {}
) {
    try {

        const { data } = await axios({
            url: BASE_URL + target,
            method: method,
            headers: token
                ? {
                    Authorization: `Bearer ${token}`
                    }
                : {},
            withCredentials: true,
            ...options
        });
        return data;
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

        navigate('/error');
        throw e;
    }
}
