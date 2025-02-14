import * as server from 'express';
import { Region, RegionModel } from '../models/regionModels';
import { STATUS } from '../enums';

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

  const user = await RegionModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Region not found' });
  }

  return user;
});

regionRouter.post('/', async (req, res) => {
  const params = req.body;
  console.log('params', params)

  try {
    const region:Region = await RegionModel.create({ ...params })
    console.log('create region object', region)
    return res.sendStatus(201)
  } catch (error) {
    console.log('error', error)
    res.status(STATUS.BAD_REQUEST).json({error: error._message})
  }

});

regionRouter.put('/:id', async (req, res) => {
  const { id } = req.params;

  const region = await RegionModel.findOne({ _id: id }).lean();

  if (!region) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: 'Region not found' });
  }

  await RegionModel.findByIdAndUpdate(region);

  return res.sendStatus(201);
});


regionRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await RegionModel.deleteOne({ _id: id }).lean()

  return res.sendStatus(STATUS.OK)
})