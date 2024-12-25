import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { Server } from './src/server';

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

startServer();

app.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Error: address already in use');
  } else {
    console.log(err);
  }
});
