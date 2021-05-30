import { Router } from 'express';
import CharactersController from '../controllers/CharactersController';

const charactersRouter = Router();

const charactersController = new CharactersController();

charactersRouter.get('/', charactersController.index);
charactersRouter.get('/:marvel_id', charactersController.show);

export default charactersRouter;
