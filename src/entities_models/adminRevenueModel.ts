import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRevenue extends Document {
  date: Date;      
  revenue: number;    
  sellerId?: Types.ObjectId;  
  productId?: Types.ObjectId; 
}

const AdminRevenueSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },

  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'Seller',
    required: false,  
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,  
  },
}, {
  timestamps: true  
});

const Revenue = mongoose.model<IRevenue>('AdminRevenueSchema', AdminRevenueSchema);
export default Revenue;
