import * as mongoose from 'mongoose';
import { getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose";
import ObjectId = mongoose.Types.ObjectId;
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { isUserLocationValid } from '../validations/userLocationValidation';

@pre<UserLocation>('validate', async function (next) {
  let {type} = this
  const {coordinates} = this
  
  if (!type || type != 'Point') {
    type = "Point"
  }

  isUserLocationValid.call(this, coordinates)

  next()
})

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class UserLocation extends Base {
  @prop({ required: true, default: 'Point', type: () => String, enum: ['Point'] })
  public type: string

  @prop({ required: true, default: undefined, type: () => [Number] })
  public coordinates!: [number]
}

export const UserLocationModel = getModelForClass(UserLocation);