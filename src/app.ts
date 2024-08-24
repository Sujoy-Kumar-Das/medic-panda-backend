import cors from 'cors';
import express from 'express';
import globalErrorHandler from './app/middlewares/globalErrrorHandler';
import notFound from './app/middlewares/not-found';
import router from './app/routes';

const app = express();

app.use(cors());

//parsers
app.use(express.json());

// routes
app.use(router);

// middlewares
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
