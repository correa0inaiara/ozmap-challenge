import * as server from 'express';
import { RegionModel } from '../models/regionModels';
import { STATUS } from '../enums';
import { RegionLocation } from '../models/regionLocationModel';
import { isObjectID, parseBoolean } from '../utils';

export const regionRouter = server.Router();

regionRouter.get('/', async (req, res) => {
  const { page, limit, expand } = req.query;
  try {

    if (parseBoolean(expand)) {
      const opts = {
        path: 'user'
      }
      const [regions, total] = await Promise
        .all([RegionModel
        .find()
        .populate(opts), 
        RegionModel.count()]);

        return res.json({
          rows: regions,
          page,
          limit,
          total,
        });
    } else {
      const [regions, total] = await Promise
        .all([RegionModel
        .find(), 
        RegionModel.count()]);
        
        return res.json({
          rows: regions,
          page,
          limit,
          total,
        });
    }
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error na chamada do servidor. ' + error,
    });
  }
});

regionRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { expand } = req.query;
  let region

  try {

    if (parseBoolean(expand)) {
      const opts = {
        path: 'user'
      }

      region = await RegionModel.findOne({ _id: id }).populate(opts)

    } else {
      region = await RegionModel.findOne({ _id: id })
    }

    if (!region) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
    }

    return res.status(STATUS.OK).json(region);
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: error }); 
  }
});

regionRouter.post('/', async (req, res) => {
  
  try {
    const { name, user, location } = req.body;
    
    const new_location = new RegionLocation();
    new_location.type = 'Polygon';
    new_location.coordinates = location.coordinates;

    const region = new RegionModel({
      name,
      user,
      location: new_location
    });

    await region.save();

    return res.status(STATUS.OK).json(region);
  } catch (error) {
    return res.status(STATUS.BAD_REQUEST).json({error: error?.errors})
  }

});

regionRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  params._id = id

  if (!params) {
    return res.status(STATUS.BAD_REQUEST).json({message: 'You need to specify the parameters to update'})
  }

  try {

    const region = await RegionModel.findOne({ _id: id });

    region._id = params._id

    if (!region) {
      return res.status(STATUS.NOT_FOUND).json({ message: 'Region not found' });
    }

    if (params.user && !isObjectID(params.user)) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'User needs to be an ObjectID'})
    }

    if (params.location && !params.location.coordinates) {
      return res.status(STATUS.BAD_REQUEST).json({message: 'You need to provide the coordinates of location'})
    }

    const name = params.name ? params.name : region.name
    const user = params.user ? params.user : region.user
    let location = region.location ? region.location : null

    if (params.location && params.location.coordinates) {
      const new_location = new RegionLocation();
      new_location.type = 'Polygon';
      new_location.coordinates = params.location.coordinates;
      location = new_location
    }
    
    const new_region = new RegionModel({
      name,
      user,
      location: location
    })

    await new_region.validate()
    await new_region.save();
    return res.status(STATUS.UPDATED).json(new_region)
     
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