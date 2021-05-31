import ensureAuthenticated from '@modules/users/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import CharactersController from '../controllers/CharactersController';

const charactersRouter = Router();

const charactersController = new CharactersController();

charactersRouter.get('/', ensureAuthenticated, charactersController.index);
charactersRouter.get(
  '/:marvel_id',
  ensureAuthenticated,
  charactersController.show
);

charactersRouter.patch('/', ensureAuthenticated, charactersController.update);

export default charactersRouter;
