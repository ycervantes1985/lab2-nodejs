import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as redis from 'redis';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import healthRouter from './src/routes/index';
import errorMiddleware from './src/middleware/error.middleware';
import logger from './src/utils/logger';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(bodyParser.json());
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



mongoose.connect(process.env.DATABASE_URL || '', {});


const db = mongoose.connection;
db.on('error', (err) => logger.error(`Error de conexión a MongoDB: ${err.message}`));
db.once('open', () => logger.info('Conectado a MongoDB'));

const redisClient = redis.createClient(process.env.REDIS_HOST || '' as any);

redisClient.on('error', (err) => logger.error(`Error de conexión a Redis: ${err.message}`));

io.on('connection', (socket) => {
  logger.info('Nuevo cliente conectado');
  // Lógica de Socket.IO aquí
});

app.use(errorMiddleware);

const PORT = process.env.SERVER_PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});