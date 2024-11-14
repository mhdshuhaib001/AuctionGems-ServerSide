import { Product } from "../model/seller";

export interface IAuctionRepository {
  placeBid( bidderId: string,auctionId: string,sellerId: string,currentBid: Number,bidAmount: Number): Promise<any | null>;
  updateAuctionBid(auctionId: string, newBid: Number): Promise<void>;
  updateAuctionStatus(auctionId: string, status: string): Promise<void>
  getBiddings(auctionId: string): Promise<any[]>
  getAuctionItem(id: string): Promise<Product>
  getActiveAuctions(currentTimeInIST: any): Promise<any[]>
  findById(auctionId: string):Promise<any>
  resetAuctionBids(auctionId: string): Promise<void>
  getAuctionItems(id: string): Promise<any> 
  getAuctionsAwaitingPayment(): Promise<any[]>
}
