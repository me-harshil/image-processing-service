import express from 'express';
import connectDB from '@/server';
import config from '@/config/config';
import { logger } from '@/config/logger';
import routeController from "@/controller";
import * as swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";
import AppError from '@/utils/appError';
import multer from 'multer';
import globalErrorHandler from '@/middleware/errorHandler.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(multer().none());
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startServer = async () => {
  await connectDB();
  app.use("/api/v1", routeController);

  // app.all("*", (req, _res, next) => {
  //   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // });

  app.use(globalErrorHandler);

  app.listen(config.PORT, () => {
    logger.info(`Server started at http://localhost:${config.PORT}`);
  })
}

startServer();
