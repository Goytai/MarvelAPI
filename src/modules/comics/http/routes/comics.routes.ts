import { Router } from 'express';
import ensureAuthenticated from '@modules/users/http/middlewares/ensureAuthenticated';
import ComicsController from '../controllers/ComicsController';

const comicsRouter = Router();

const comicsController = new ComicsController();

comicsRouter.get('/', ensureAuthenticated, comicsController.index);
comicsRouter.get('/:marvel_id', ensureAuthenticated, comicsController.show);

comicsRouter.patch('/', ensureAuthenticated, comicsController.update);
comicsRouter.delete('/', ensureAuthenticated, comicsController.delete);

export default comicsRouter;
