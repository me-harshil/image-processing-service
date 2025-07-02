import express from 'express';
import connectDB from '@/server';
import config from '@/config/config';
import { logger } from '@/config/logger';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    logger.info(`Server started at http://localhost:${config.PORT}`);
  })
}

startServer();
