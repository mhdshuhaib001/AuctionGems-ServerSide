import { Schema, model, Document } from 'mongoose';
import {IAddress} from '../interfaces/model/address'

const addressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AddressModal = model<IAddress>('Address', addressSchema);

export default AddressModal;
