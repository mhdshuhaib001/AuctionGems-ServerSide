import { Schema, Document, Model, model } from "mongoose";

interface WalletHistory {
  amount: number;
  transactionType: "credit" | "debit";
  description: string;
  date: Date;
}

interface Wallet extends Document {
  balance: number;
  walletHistory: WalletHistory[];
}

const walletHistorySchema = new Schema<WalletHistory>({
  amount: { type: Number, required: true },
  transactionType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const walletSchema = new Schema<Wallet>({
  balance: { type: Number, default: 0 },
  walletHistory: { type: [walletHistorySchema], default: [] },
});

const WalletModel: Model<Wallet> = model<Wallet>("Wallet", walletSchema);

export { WalletModel, Wallet };
