import { Router } from 'express';
import ComicsController from '../controllers/ComicsController';

const comicsRouter = Router();

const comicsController = new ComicsController();

comicsRouter.get('/', comicsController.index);
comicsRouter.get('/:marvel_id', comicsController.show);

export default comicsRouter;
