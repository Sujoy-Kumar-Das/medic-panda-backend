import express from 'express';
import router from './app/routes';
const app = express();

//parsers
app.use(express.json());

// routes
app.use(router);

export default app;
