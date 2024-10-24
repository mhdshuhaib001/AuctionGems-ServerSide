import { log } from 'console';
import AuctionRepository from '../infrastructure/repositories/AuctionRepository';
import UserRepository from '../infrastructure/repositories/UserRepositories';
import IAuctionUseCase from '../interfaces/iUseCases/iAuctionUseCase';
import NodeMailer from '../providers/nodeMailer';
import { getSocketInstance } from '../infrastructure/config/services/auctionSocket';
import ProductModel from '../entities_models/productModal';
require('dotenv').config();


interface BidTypes {
  auctionId: string;
  bidderId: string;
  sellerId?: string;
  bidAmount: Number;
  currentBid: Number; 
  time: Date;
}

class AuctionUseCase implements IAuctionUseCase {
  constructor(private readonly _auctionRepository: AuctionRepository , private readonly _userRepository: UserRepository,private readonly _mailer:NodeMailer) {}

  async placeBid(bid: BidTypes): Promise<void> {
    try {
      const { auctionId, bidderId, currentBid, bidAmount, sellerId, time } = bid;


      // Call the repository method to place the bid
      const result = await this._auctionRepository.placeBid(bidderId, auctionId, sellerId || '', bidAmount, currentBid);

      if (!result) {
        throw new Error('Failed to place bid in the database');
      }

    } catch (error) {
      console.error('Error placing bid:', error);
      throw error; 
    }
  }

  async fetchBidders(auctionId: string): Promise<any[]> {
    try {
      const bids = await this._auctionRepository.getBiddings(auctionId);
      
      const sortedBids = bids.sort((a, b) => b.currentBid - a.currentBid);

      const topBids = sortedBids.slice(0, 5); 

      const biddersData = await Promise.all(topBids.map(async (bid) => {
        const userData = await this._userRepository.findById(bid.buyerID.toString()); 
        
        if (!userData) {
          return null;
        }

        console.log(bid)
        return {
          id: bid._id,
          bidder: userData.name, 
          amount: bid.currentBid,
          time: bid.time,
          avatar: userData.profileImage || 'default-avatar-url',
        };
      }));

      const filteredBiddersData = biddersData.filter(bid => bid !== null);

      return filteredBiddersData;

    } catch (error) {
      console.error('Error fetching bidders:', error);
      throw error; 
    }
  }

  // async endAuctionAndNotifyWinner(auctionId: string): Promise<void> {
  //   try {
  //     const auctionItem = await this._auctionRepository.getAuctionItem(auctionId);

  //     if (!auctionItem) {
  //       throw new Error('Auction not found');
  //     }

  //     const currentTime = new Date();

  //     if (currentTime < auctionItem?.auctionEndDateTime) {
  //       console.log('Auction is still running....');
  //       return;
  //     }

  //     const bids = await this._auctionRepository.getBiddings(auctionId);

  //     if (!bids || bids.length === 0) {
  //       console.log('No bids were placed for this auction.');
  //       return;
  //     }

  //     // Sort bids by bid amount (descending) and time (to break ties)
  //     const sortedBids = bids.sort((a, b) => {
  //       if (b.currentBid === a.currentBid) {
  //         return new Date(b.time).getTime() - new Date(a.time).getTime(); 

  //       } else {
  //         return b.currentBid - a.currentBid; // Sort by currentBid
  //       }
  //     });

  //     const highestBid = sortedBids[0];

  //     // Find the user who placed the highest bid
  //     const winner = await this._userRepository.findById(highestBid.buyerID.toString());

  //     if (!winner) {
  //       throw new Error('Highest bidder not found');
  //     }

  //     // Notify the winner
  //     // await this.notifyWinner(winner.email, auctionItem.itemTitle, highestBid.currentBid);

  //     console.log(`Winner ${winner.name} has been notified.`);

  //   } catch (error) {
  //     console.error('Error ending auction or notifying winner:', error);
  //     throw error;
  //   }
  // }

  async endAuctionAndNotifyWinner(auctionId: string): Promise<void> {
    try {
        const auctionItem = await this._auctionRepository.getAuctionItem(auctionId);

        if (!auctionItem) {
            throw new Error('Auction not found');
        }

        const currentTime = new Date();
        if (currentTime < auctionItem?.auctionEndDateTime) {
            console.log('Auction is still running....');
            return;
        }

        const bids = await this._auctionRepository.getBiddings(auctionId);

        if (!bids || bids.length === 0) {
            console.log('No bids were placed for this auction.');
            return;
        }

        const sortedBids = bids.sort((a, b) => {
            if (b.currentBid === a.currentBid) {
                return new Date(b.time).getTime() - new Date(a.time).getTime();
            } else {
                return b.currentBid - a.currentBid;
            }
        });

        const highestBid = sortedBids[0];
        const winner = await this._userRepository.findById(highestBid.buyerID.toString());

        if (!winner) {
            throw new Error('Highest bidder not found');
        }

        const paymentLink = `${process.env.FRONTEND_URL}/checkout/${auctionId}`;
        const emailSent = await this._mailer.sendWinnerMail(winner.email, auctionItem.itemTitle, highestBid.currentBid, paymentLink, auctionItem.images[0]);

        if (emailSent) {
            console.log('Winner notification email sent successfully.');
        } else {
            console.log('Failed to send winner notification email.');
        }

        await ProductModel.findByIdAndUpdate(auctionId, {
            sold: true,
            finalBidAmount: highestBid.currentBid,
        });

        const io = getSocketInstance();
        if (winner && winner._id) {
            io.to(auctionId).emit('auctionEnded', {
                winner: winner._id.toString(),
                amount: highestBid.currentBid,
            });
        }
        
    } catch (error) {
        console.error('Error ending auction or notifying winner:', error);
        throw error;
    }
}


async getAllActiveAuctions(): Promise<any[]> {
  try {
    // const currentTime = new Date();
    const currentTime = new Date('2024-10-23T04:01:00Z');

    const activeAuctions = await this._auctionRepository.getActiveAuctions(currentTime);
    
    return activeAuctions;
  } catch (error) {
    console.error('Error fetching active auctions:', error);
    throw error;
  }
}


}

export default AuctionUseCase;
