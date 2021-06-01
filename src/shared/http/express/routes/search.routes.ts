import { Router } from 'express';
import ensureAuthenticated from '@modules/users/http/middlewares/ensureAuthenticated';

import SearchController from '../controllers/SearchController';

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.get('/', ensureAuthenticated, searchController.index);

export default searchRouter;
