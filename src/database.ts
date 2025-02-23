import mongoose from 'mongoose';
import { log } from './logs';

const init = async function () {
  log.info({database: 'initializing database'});
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => log.info({database: 'database connected'}))
      .catch((err) => log.error({database: err}));
  } catch (err) {
    log.error({database: err});
  }
};

export default init();
