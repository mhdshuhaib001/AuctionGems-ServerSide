import cron from 'node-cron';
import AuctionUseCase from '../use-case/auctionUseCase';
import AuctionRepository from '../infrastructure/repositories/AuctionRepository';
import UserRepository from '../infrastructure/repositories/UserRepositories';
import NodeMailer from '../providers/nodeMailer';

const auctionRepository = new AuctionRepository();
const userRepository = new UserRepository();
const mailer = new NodeMailer()
const auctionUseCase = new AuctionUseCase(auctionRepository, userRepository,mailer);

export const initAuctionCronJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Checking for ended auctions...');
    try {
      const auctions = await auctionUseCase.getAllActiveAuctions(); 

      console.log(auctions,'================================================')
      for (const auction of auctions) {
        console.log('haloooooooooooo................')
        await auctionUseCase.endAuctionAndNotifyWinner(auction.id);
      }
      console.log('Auction check completed.');
    } catch (error) {
      console.error('Error during auction check:', error);
    }
  });
};
