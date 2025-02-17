import * as mongoose from 'mongoose';
import { getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import ObjectId = mongoose.Types.ObjectId;
import { isRegionLocationValid } from '../validations/regionLocationValidation';

@pre<RegionLocation>('validate', async function (next) {
  let {type} = this
  const {coordinates} = this
  
  if (!type || type != 'Polygon') {
    type = "Polygon"
  }

  isRegionLocationValid.call(this, coordinates)

  next()
})

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class RegionLocation extends Base {
  @prop({ required: true, default: 'Polygon', type: () => String, enum: ['Polygon'] })
  public type: string

  @prop({ required: true, default: undefined, type: () => [[[Number, Number]]] })
  public coordinates!: [[[number, number], [number, number], [number, number], [number, number], ...[number, number][]]]
}

export const RegionLocationModel = getModelForClass(RegionLocation);