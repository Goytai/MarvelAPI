import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import routes from './routes';
import errorHandlingMiddleware from './middlewares/errorHandlingMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandlingMiddleware);

export default app;
