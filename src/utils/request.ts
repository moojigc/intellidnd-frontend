import axios, { Method, AxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = /intellidnd.com/i.test(location.host)
    ? 'https://api.intellidnd.com/v1'
    : 'http://localhost:4000/v1'

export default async function request(
	target: string,
	method: Method = 'GET',
    token?: string,
	options: AxiosRequestConfig = {}
) {

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
