import 'reflect-metadata';

import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose';
import lib from './lib';

import ObjectId = mongoose.Types.ObjectId;
// import { checksNameValidity } from './validators';

@modelOptions({ schemaOptions: { validateBeforeSave: true } })

class Base extends TimeStamps {
  @prop({ required: true, default: () => new ObjectId().toString() })
  _id: string;
}

const checkGeolocationInput = async function (data) {

//   console.log('checkGeolocationInput')
//   // // const user = this
//   // console.log('this context', this)
//   // // const validated = await user.validate()
//   // console.log('this validated', this.errors)
  console.log('data', data)

//   // no address, no coordinates
  if (!data.address && data.coordinates.length == 0) {
    console.log('sem endereço ou coordenadas')
    // new Error('You need to provide an address or coordinates')

    return false
  }

  if (data.address && data.coordinates.length > 0) {
    console.log('com endereço e coordenadas')
    // new Error('You can\'t provide both address and coordinates. Pick one')
    // next();
    return false
  }

//   // next();
}

@pre<User>('validate', async function (next) {
  console.log('this', this)

  // if (!this.address) {
  //   const validationError = this.invalidate(
  //     'address'
  //   );
  //   next(validationError);
  // }


  if (!this.address && this.coordinates.length == 0) {
    console.log('sem endereço ou coordenadas')
    // this.geolocationValid = false
    // this.set("geolocationValid", false)
    // next()
    // next(error: 'oops')
      const validationErrors = []
      validationErrors.push(this.invalidate(
        'address',
        'You didn\'t prodided an address'
      ))
      validationErrors.push
      next(validationErrors);
    // new Error('You need to provide an address or coordinates')
  }

  console.log('this.coordinates length', this.coordinates.length)
  console.log('this.coordinates', this.coordinates)

  if (this.address && this.coordinates.length > 0) {
    console.log('com endereço e coordenadas')
    // this.set("geolocationValid", false)
    // this.geolocationValid = false
    // next()
    // next(new Error('Oops!'))
    const validationError = this.invalidate(
      'address',
      'coordinates'
    );
    next(validationError);
    // new Error('You can\'t provide both address and coordinates. Pick one')
    // next();
  }

  // this.set("geolocationValid", true)
  next()
})

@pre<User>('save', async function (next) {
  console.log('user save')
  
  // const user = this as Omit<any, keyof User> & User;

  // if (user.isModified('coordinates')) {
  //   user.address = await lib.getAddressFromCoordinates(user.coordinates);
  // } else if (user.isModified('address')) {
  //   const { lat, lng } = await lib.getCoordinatesFromAddress(user.address);

  //   user.coordinates = [lng, lat];
  // }

  next();
})

// const nameValidators = [
//   { validator: checksNameValidity, message: 'Name is not valid.' }
// ]
// , validate: nameValidators
// @modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class User extends Base {
  @prop({ required: true }) //, validate: async (value) => { await checkGeolocationInput(value) }
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: false, default: '', type: () => [String] })
  public address: string;

  @prop({ required: true, default: [], type: () => [Number] })
  public coordinates: mongoose.Types.Array<number>;

  @prop({ required: true, default: [], ref: () => Region, type: () => String })
  public regions: Ref<Region>[];

  // @prop({ validate: [
  //   {
  //     validator: async (value) => { await checkGeolocationInput(value) },
  //     message: 'You need to provide either address and coordinates.'
  //   }
  // ] })
  // public geolocationValid: boolean
}

@pre<Region>('save', async function (next) {
  const region = this as Omit<any, keyof Region> & Region;

  if (!region._id) {
    region._id = new ObjectId().toString();
  }

  if (region.isNew) {
    const user = await UserModel.findOne({ _id: region.user });
    user.regions.push(region._id);
    await user.save({ session: region.$session() });
  }

  next(region.validateSync());
})

export class Region extends Base {
  @prop({ required: true, auto: true })
  _id: string;

  @prop({ required: true })
  name!: string;

  @prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>;
}

export const UserModel = getModelForClass(User);
export const RegionModel = getModelForClass(Region);
