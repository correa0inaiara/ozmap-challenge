import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Region } from './regionModels';

import ObjectId = mongoose.Types.ObjectId;

@modelOptions({ schemaOptions: { validateBeforeSave: true } })

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@pre<User>('save', async function (next) {
  console.log('user save')

  next();
})

export class User extends Base {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: false, default: '', type: () => [String] })
  public address: string;

  @prop({ required: true, default: [], type: () => [Number] })
  public coordinates: mongoose.Types.Array<number>;

  @prop({ required: true, default: [], ref: () => Region, type: () => String })
  public regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);
