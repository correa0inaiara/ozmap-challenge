import * as app from 'express';
import init from './database';
import { userRouter } from './routes/userRoutes';
import { regionRouter } from './routes/regionRoutes';
import * as bodyParser from 'body-parser';

const PORT = 3003;
// const HOST = '127.0.0.1';
const server = app();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const database = init
main()

export default async function main() {
  
  server.use(bodyParser.json())
  server.use('/users', userRouter);
  server.use('/regions', regionRouter);
  server.listen(PORT, () => {
    console.log('listining on port 3003');
  });
}