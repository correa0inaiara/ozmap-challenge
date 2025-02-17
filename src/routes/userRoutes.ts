import * as server from 'express';
import { UserModel } from '../models/userModels';
import { STATUS } from '../enums';
import { isObjectID, isValid } from '../utils';
import { UserLocationModel } from '../models/userLocationModel';
import * as mongoose from 'mongoose';

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

  if (!params.location) {
    return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the location'})
  }

  const locationParams = params.location

  try {
    const location = await UserLocationModel.create(locationParams)
    params.location = location._id
    const user = await UserModel.create(params)
    
    console.log('create location object', location)
    console.log('create user object', user)
    return res.status(STATUS.CREATED).json(user)
  } catch (error) {
    console.log('error', error)
    return res.status(STATUS.BAD_REQUEST).json({error: error?.errors})
  }

});

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  params._id = id

  try {
    const user = await UserModel.findOne({ _id: id });
    user._id = params._id

    if (!user) {
      return res.status(STATUS.DEFAULT_ERROR).json({ message: 'User not found' });
    }

    if (!user.location && !params.location) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide a location'})
    }

    if (!(params.location instanceof mongoose.Types.ObjectId) && !params.location.coordinates) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the coordinates of location'})
    }

    if (params.location.coordinates) {
      const locationParams = params.location
      const location = await UserLocationModel.create(locationParams)
      params.location = location._id
    }

    if (isObjectID(params.location)) {
      user.location = params.location
      user.address = undefined
    }
      
    if (isValid(params.name)) {
      user.name = params.name
    }

    if (isValid(params.email)) {
      user.email = params.email
    }

    if (isValid(params.address)) {
      user.address = params.address
      user.location = undefined
    }

    await user.validate()
    await user.save();
    res.status(STATUS.UPDATED).json(user)
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({error: err?.errors})
  }

});

userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.deleteOne({ _id: id }).lean()

    if (!user || user?.deletedCount == 0) {
      return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
    }
    
    return res.status(STATUS.OK).json(user);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }
})