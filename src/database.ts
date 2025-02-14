import mongoose from 'mongoose';

const env = {
  // MONGO_URI: 'mongodb://root:example@127.0.0.1:27017/oz-tech-test?authSource=admin',
  // MONGO_URI: 'mongodb://root:example@localhost:27017/oz-tech-test?authSource=admin',
  MONGO_URI: 'mongodb+srv://root:example@cluster0.lxs9k.mongodb.net/oz-tech-test?authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
};

const init = async function () {
  console.log('initializing database');
  try {
    await mongoose
      .connect(env.MONGO_URI)
      .then(() => console.log('database connected'))
      .catch((err) => console.log('error: ', err));
    // return mongodb;
  } catch (error) {
    console.log('error', error);
  }
  // mongodb.getClient();
};

export default init();
