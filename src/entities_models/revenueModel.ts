import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRevenue extends Document {
  date: string;      
  revenue: number;    
  sellerId?: Types.ObjectId;  
  productId?: Types.ObjectId; 
}

// Define the Revenue schema
const RevenueSchema: Schema = new Schema({
  date: {
    type: String,
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

const Revenue = mongoose.model<IRevenue>('Revenue', RevenueSchema);
export default Revenue;
