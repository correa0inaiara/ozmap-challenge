import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose';
import { User, UserModel } from './userModels';

import ObjectId = mongoose.Types.ObjectId;

@modelOptions({ schemaOptions: { validateBeforeSave: true } })

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<Region>('save', async function (next) {
  // const region = this as Omit<any, keyof Region> & Region;

  // if (!region._id) {
  //   region._id = new ObjectId().toString();
  // }

  // if (region.isNew && region.user) {
  //   const user = await UserModel.findOne({ _id: region!.user });
  //   user.regions.push(region._id);
  //   await user.save({ session: region.$session() });
  // }

  // next(region.validateSync());
  next()
})

class Nested {
  @prop()
  public nestProp: User | string
}

export class Region extends Base {
  @prop({ required: true, auto: true })
  _id: string;

  @prop({ required: true })
  name!: string;

  @prop({ ref: () => Nested, type: () => String })
  user!: Ref<Nested, string>;
}

export const RegionModel = getModelForClass(Region);
