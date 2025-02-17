import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Region } from './regionModels';

import ObjectId = mongoose.Types.ObjectId;
import { isUserValid } from '../validations/userValidations';


@pre<User>('validate', async function (next) {
  const {address, coordinates} = this

  isUserValid.call(this, address, coordinates)

  next()
})

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class User extends Base {
  @prop({ required: true, type: () => [String], match: /^([a-zA-Z ])*$/})
  public name!: string;

  @prop({ required: true, match: /^([a-zA-Z.0-9])*@{1}([a-zA-Z.0-9])*.{1}([a-zA-Z])*$/ })
  public email!: string;

  @prop({ type: () => [String] })
  public address: string;

  @prop({ type: () => [Number] })
  public coordinates: mongoose.Types.Array<number>;

  @prop({ required: true, default: [], ref: () => Region, type: () => String })
  public regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);