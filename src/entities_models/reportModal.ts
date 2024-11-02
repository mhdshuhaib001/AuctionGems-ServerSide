import mongoose, { Document, Schema } from 'mongoose';
import { IReport } from '../interfaces/model/IReport';

const ReportSchema: Schema<IReport> = new Schema({
    reason: { type: String, required: true },
    details: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Resolved', 'Dismissed'], default: 'Pending' },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }, 
});

export default mongoose.model<IReport>('Report', ReportSchema);
