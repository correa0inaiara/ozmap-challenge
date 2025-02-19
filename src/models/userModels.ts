import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import ObjectId = mongoose.Types.ObjectId;
import { isUserValid } from '../validations/userValidations';
import { UserLocation } from './userLocationModel';


@pre<User>('validate', async function (next) {
  const {address, location} = this

  isUserValid.call(this, address, location)

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

  @prop({ type: () => UserLocation })
  public location: mongoose.Types.ObjectId
}

export const UserModel = getModelForClass(User);