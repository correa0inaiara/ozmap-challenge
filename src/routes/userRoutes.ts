import * as server from 'express';
import { UserModel } from '../models/userModels';
import { STATUS } from '../enums';
import { UserLocation } from '../models/userLocationModel';
import { log } from '../logs';

export const userRouter = server.Router();

userRouter.get('/', async (req, res) => {
  const { page, limit } = req.query;

  try {
    const [users, total] = await Promise.all([UserModel.find().populate('location'), UserModel.count()]);
    
    return res.json({
      rows: users.reverse(),
      page,
      limit,
      total,
    });
  } catch (error) {
    log.error({api: error})
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error na chamada do servidor. ' + error,
    });
  }
});

userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findOne({ _id: id }).populate('location')

    if (!user) {
      log.error({api: 'User not found'})
      return res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
    }
    
    res.status(STATUS.OK).json(user);
  } catch (error) {
    log.error({api: error})
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }

});

userRouter.post('/', async (req, res) => {
  
  try {
    const { name, email, address, location } = req.body;

    if (address && location) {
      log.error({api: 'Only one option is acceptable: address or location.'})
      return res.status(STATUS.BAD_REQUEST).json({message: 'Only one option is acceptable: address or location.'});
    }

    if (!address && !location) {
      log.error({api: 'You need to provide either address or location'})
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide either address or location'});
    }

    if (location && !location.coordinates) {
      log.error({api: 'You need to provide the coordinates of location'})
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the coordinates of location'});
    }

    let user
    if (location) {
      const new_location = new UserLocation();
      new_location.type = 'Point';
      new_location.coordinates = location.coordinates;

      user = new UserModel({
        name,
        email,
        address: null,
        location: new_location
      });
      await user.populate('location')
    }

    if (address) {

      user = new UserModel({
        name,
        email,
        address,
        location: null
      });
    }

    await user.save();
    return res.status(STATUS.OK).json(user);

  } catch (error) {
    log.error({api: error})
    return res.status(STATUS.BAD_REQUEST).json({error: error?.errors})
  }

});

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  params._id = id

  if (!params) {
    log.error({api: 'You need to specify the parameters to update'})
    return res.status(STATUS.BAD_REQUEST).json({message: 'You need to specify the parameters to update'})
  }

  try {

    const user = await UserModel.findOne({ _id: id });
    user._id = params._id

    if (!user) {
      log.error({api: 'User not found'})
      return res.status(STATUS.NOT_FOUND).json({ message: 'User not found' });
    }

    if (params.address && params.location) {
      log.error({api: 'Only one option is acceptable: address or location.'})
      return res.status(STATUS.BAD_REQUEST).json({message: 'Only one option is acceptable: address or location.'});
    }

    if (params.location && !params.location.coordinates) {
      log.error({api: 'You need to provide the coordinates of location'})
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the coordinates of location'})
    }

    let new_user
    const name = params.name ? params.name : user.name
    const email = params.email ? params.email : user.email
    let address = user.address ? user.address : null
    let location = user.location ? user.location : null

    if (params.location && params.location.coordinates) {
      const new_location = new UserLocation();
      new_location.type = 'Point';
      new_location.coordinates = params.location.coordinates;

      new_user = new UserModel({
        name,
        email,
        address: null,
        location: new_location
      })

      address = new_user.address
      location = new_user.location
    }

    if (params.address) {
      new_user = new UserModel({
        name,
        email,
        address: params.address,
        location: null
      })

      address = new_user.address
      location = new_user.location
    }

    new_user = new UserModel({
      name,
      email,
      address,
      location
    })

    await new_user.validate()
    await new_user.save();
    return res.status(STATUS.UPDATED).json(new_user)
    
  } catch (err) {
    log.error({api: err})
    return res.status(STATUS.BAD_REQUEST).json({error: err.errors ? err.errors : err})
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
    log.error({api: error})
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }
})