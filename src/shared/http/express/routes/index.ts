import express from 'express';

import usersRouter from '@modules/users/http/routes/users.routes';
import sessionsRouter from '@modules/users/http/routes/sessions.routes';
import comicsRouter from '@modules/comics/http/routes/comics.routes';
import charactersRouter from '@modules/characters/http/routes/characters.routes';
import searchRouter from './search.routes';

const route = express.Router();

route.get('/', (req, res) => res.status(200).send('Server Running'));

route.use('/users', usersRouter);
route.use('/comics', comicsRouter);
route.use('/characters', charactersRouter);
route.use('/sessions', sessionsRouter);
route.use('/search', searchRouter);

export default route;
