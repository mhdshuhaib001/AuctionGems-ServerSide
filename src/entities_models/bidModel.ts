import mongoose, { Document, Schema } from 'mongoose';

interface IBid extends Document {
    auctionId: mongoose.Types.ObjectId;  
    buyerID: mongoose.Types.ObjectId;   
    sellerID: mongoose.Types.ObjectId;    
    currentBid: number;                   
    time: Date;                       
    bidStatus: 'Active' | 'Won' | 'Lost'; 
}

const bidSchema = new Schema<IBid>({
    auctionId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    buyerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sellerID: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    currentBid: { type: Number, required: true, min: 0 },
    time: { type: Date, default: Date.now },
    bidStatus: {
        type: String,
        enum: ['Active', 'Won', 'Lost'],
        default: 'Active',
    },
});

const Bid = mongoose.model<IBid>('Bid', bidSchema);

export default Bid;
