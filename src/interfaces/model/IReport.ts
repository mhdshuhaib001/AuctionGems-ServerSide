import mongoose, { Document } from "mongoose";

export interface IReport extends Document {
  reason: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  sellerId: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
}
