import express from 'express';

import usersRouter from '@modules/users/http/routes/users.routes';

const route = express.Router();

route.get('/', (req, res) => res.status(200).send('Server Running'));

route.use('/users', usersRouter);

export default route;
