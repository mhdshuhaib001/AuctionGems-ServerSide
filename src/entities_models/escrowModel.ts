import mongoose, { Schema, Document } from 'mongoose';

export interface IEscrow extends Document {
  orderId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  totalAmount: number;
  platformFee: number;
  sellerEarnings: number;
  status: 'held' | 'released' | 'disputed';
  releaseDate?: Date;
}

export interface EscrowFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  searchType?: 'all' | 'seller' | 'buyer';
}

export interface EscrowSummary {
  totalAmount: number
  platformFee: number
  sellerEarnings: number
  count: number
}


const EscrowSchema: Schema = new Schema({
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  buyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sellerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Seller', 
    required: true 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  platformFee: { 
    type: Number, 
    required: true 
  },
  sellerEarnings: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['held', 'released', 'disputed'], 
    default: 'held' 
  },
  releaseDate: { 
    type: Date,
    default: Date.now
  }
  
}, { timestamps: true });

const Escrow = mongoose.model<IEscrow>('Escrow', EscrowSchema);
export default Escrow;