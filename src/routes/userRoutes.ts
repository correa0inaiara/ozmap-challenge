import * as server from 'express';
import { User, UserModel } from '../models/userModels';
import { STATUS } from '../enums';
import { isValid } from '../utils';

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

  try {
    const user = await UserModel.findOne({ _id: id }).lean();

    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({ message: "Usuário não encontrado" });
    }
    
    res.status(STATUS.OK).json(user);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }

});

userRouter.post('/', async (req, res) => {
  const params = req.body;
  console.log('params', params)

  try {
    const user = await UserModel.create(params)
    
    console.log('create user object', user)
    return res.status(201).json(user)
  } catch (error) {
    console.log('error', error)
    return res.status(STATUS.BAD_REQUEST).json({error: error?.errors})
  }

});

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const params = req.body as User;
  params._id = id

  try {
    await UserModel.validate(params)
    const user = await UserModel.findOne({ _id: id });
    user.id = params._id

    if (!user) {
      return res.status(STATUS.DEFAULT_ERROR).json({ message: 'User not found' });
    }
      
    if (isValid(params)) {
      user.name = params.name
    }

    if (isValid(params)) {
      user.email = params.email
    }

    if (isValid(params)) {
      user.address = params.address
    }

    if (isValid(params)) {
      user.coordinates = params.coordinates
    }

    if (isValid(params)) {
      user.regions = params.regions
    }

    await user.validate()
    const opts = { runValidators: true }
    await UserModel.findByIdAndUpdate(user, opts);
    res.status(STATUS.OK).json(user)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({error: err?.errors})
  }

});


userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.deleteOne({ _id: id }).lean()

    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({ message: "Usuário não encontrado" });
    }
    
    return res.status(STATUS.OK).json(user);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }
})