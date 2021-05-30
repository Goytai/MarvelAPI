import express from 'express';

import usersRouter from '@modules/users/http/routes/users.routes';
import comicsRouter from '@modules/comics/http/routes/comics.routes';
import charactersRouter from '@modules/characters/http/routes/characters.routes';

const route = express.Router();

route.get('/', (req, res) => res.status(200).send('Server Running'));

route.use('/users', usersRouter);
route.use('/comics', comicsRouter);
route.use('/characters', charactersRouter);

export default route;
