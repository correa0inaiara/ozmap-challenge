import mongoose from 'mongoose';

const init = async function () {
  console.log('initializing database');
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('database connected'))
      .catch((err) => console.log('error: ', err));
    // return mongodb;
  } catch (error) {
    console.log('error', error);
  }
  // mongodb.getClient();
};

export default init();
