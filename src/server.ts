import * as app from 'express';
import initDB from './database';
// import initLib from './lib';
import { userRouter } from './routes/userRoutes';
import { regionRouter } from './routes/regionRoutes';
import * as bodyParser from 'body-parser';
import { regionLocationRouter } from './routes/regionLocationRoutes';

// const HOST = '127.0.0.1';
const server = app();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const database = initDB
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const lib = initLib
main()

export default async function main() {
  
  server.use(bodyParser.json())
  server.use('/users', userRouter);
  server.use('/regions', regionRouter);
  server.use('/locations', regionLocationRouter);
  server.listen(process.env.PORT, () => {
    console.log('listining on port 3003');
  });
}