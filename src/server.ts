import * as app from 'express';
import initDB from './database';
import { userRouter } from './routes/userRoutes';
import { regionRouter } from './routes/regionRoutes';
import * as bodyParser from 'body-parser';
import { regionLocationRouter } from './routes/regionLocationRoutes';
import * as path from 'path'
import { engine } from 'express-handlebars';
import { HomeController } from './controllers/home';
import { log } from './logs';

log.info('app start up')
// const HOST = '127.0.0.1';
const server = app();
const base_path = process.env.BASE_API_PATH
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const database = initDB

main()

export default async function main() {

  // view engine config
  server.engine('.hbs', engine({ extname: '.hbs' }));
  server.set('view engine', '.hbs');
  server.set('views', path.join(__dirname, 'views'));
  server.get('/', HomeController)

  // server config
  server.use(bodyParser.json())
  server.use(base_path + '/users', userRouter);
  server.use(base_path + '/regions', regionRouter);
  server.use(base_path + '/search', regionLocationRouter);

  server.use(app.static("public"));

  server.listen(process.env.PORT, () => {
    log.info({server: 'listining on http://localhost:' + process.env.PORT})
  });
}