import axios from 'axios';
import md5 from 'md5';

const ts = String(Math.floor(Date.now() / 1000));
const apikey = '406cd9e9204bd0029f1de824eaa47512';
const privatekey = '499e9e12db1727a445112db580d4d6136958702f';
const hash = md5(`${ts}${privatekey}${apikey}`);

// const apikey = String(process.env.API_PUBLIC_KEY);
// const privatekey = String(process.env.API_PRIVATE_KEY);
// const hash = md5(`${ts}${privatekey}${apikey}`);

const api = axios.create({
  baseURL: 'http://gateway.marvel.com/v1/public/',
  params: {
    ts,
    hash,
    apikey
  }
});

export default api;
