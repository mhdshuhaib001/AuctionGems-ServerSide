import { Schema, model, Document } from 'mongoose';


export interface AddressData {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    userId: Schema.Types.ObjectId;
  }
  


  export interface IAddress extends Document {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }


