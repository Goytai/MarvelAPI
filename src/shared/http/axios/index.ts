import axios from 'axios';
import md5 from 'md5';

const ts = String(Math.floor(Date.now() / 1000));
const apikey = String(process.env.API_PUBLIC_KEY);
const privatekey = String(process.env.API_PRIVATE_KEY);
const hash = md5(`${ts}${privatekey}${apikey}`);

const api = axios.create({
  baseURL: 'http://gateway.marvel.com/v1/public/',
  params: {
    ts,
    hash,
    apikey
  }
});

export default api;
