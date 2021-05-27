import express from 'express';

const route = express.Router();

route.get('/', (req, res) => res.status(200).send('Server Running'));

export default route;
