import * as server from 'express';
import { User, UserModel } from '../models/userModels';
import { STATUS } from '../enums';

export const userRouter = server.Router();

userRouter.get('/', async (req, res) => {
  const { page, limit } = req.query;

  try {
    const [users, total] = await Promise.all([UserModel.find().lean(), UserModel.count()]);

    return res.json({
      rows: users,
      page,
      limit,
      total,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error na chamada do servidor',
    });
  }
});

userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'User not found' });
  }

  return user;
});

userRouter.post('/', async (req, res) => {
  const params = req.body;
  console.log('params', params)

  try {
    const user:User = await UserModel.create({ ...params })
    console.log('create user object', user)
    return res.sendStatus(201)
  } catch (error) {
    console.log('error', error)
    res.status(STATUS.BAD_REQUEST).json({error: error._message})
  }

});

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: 'User not found' });
  }
  

  user.name = update.name;
  user.email = update?.email

  await UserModel.findByIdAndUpdate(user);

  return res.sendStatus(201);
});


userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await UserModel.deleteOne({ _id: id }).lean()

  return res.sendStatus(STATUS.OK)
})