import * as app from 'express';
import init from './database';
import { userRouter } from './routes/userRoutes';
import { regionRouter } from './routes/regionRoutes';
import * as bodyParser from 'body-parser';

const PORT = 3003;
// const HOST = '127.0.0.1';
const server = app();
const database = init
main()

export default async function main() {
  
  // console.log(server)
  server.use(bodyParser.json())
  server.use('/users', userRouter);
  server.use('/regions', regionRouter);
  server.listen(PORT, () => {
    console.log('listining on port 3003');
  });
}