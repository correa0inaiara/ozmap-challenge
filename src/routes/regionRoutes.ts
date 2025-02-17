import * as server from 'express';
import { RegionModel } from '../models/regionModels';
import { STATUS } from '../enums';
import { RegionLocationModel } from '../models/regionLocationModel';
import { isObjectID, isValid } from '../utils';
import * as mongoose from 'mongoose';

export const regionRouter = server.Router();

regionRouter.get('/', async (req, res) => {
  const { page, limit } = req.query;

  try {
    const [regions, total] = await Promise.all([RegionModel.find().lean(), RegionModel.count()]);

    return res.json({
      rows: regions,
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

regionRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const region = await RegionModel.findOne({ _id: id }).lean();

    if (!region) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
    }

    return res.status(STATUS.OK).json(region);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }
});

regionRouter.post('/', async (req, res) => {
  const params = req.body;
  
  if (!params.location) {
    return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the location'})
  }

  const locationParams = params.location

  try {
    const location = await RegionLocationModel.create(locationParams)
    params.location = location._id
    const region = await RegionModel.create(params)

    console.log('create location object', location)
    console.log('create region object', region)
    return res.status(STATUS.CREATED).json(region)
  } catch (error) {
    console.log('error', error)
    return res.status(STATUS.BAD_REQUEST).json({error: error?.errors})
  }

});

regionRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const params = req.body
  params._id = id

  try {
    const region = await RegionModel.findOne({ _id: id });
    region._id = params._id

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Region not found' });
    }

    if (!region.location && !params.location) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide a location'})
    }

    if (!(params.location instanceof mongoose.Types.ObjectId) && !params.location.coordinates) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the coordinates of location'})
    }

    if (params.location.coordinates) {
      const locationParams = params.location
      const location = await RegionLocationModel.create(locationParams)
      params.location = location._id
    }

    if (isObjectID(params.location)) {
      region.location = params.location
    }

    if (isValid(params.name)) {
      region.name = params.name
    }

    if (isObjectID(params.user)) {
      region.user = params.user
    }

    await region.validate()
    await region.save();
    return res.status(STATUS.UPDATED).json(region);
  } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({error: err?.errors})
  }

});


regionRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const region = await RegionModel.deleteOne({ _id: id }).lean()

      if (!region || region?.deletedCount == 0) {
        return res.status(STATUS.NOT_FOUND).json({ message: "Region not found" });
      }
      
      return res.status(STATUS.OK).json(region);
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
    }
})