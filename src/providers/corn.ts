import cron from 'node-cron';
import AuctionUseCase from '../use-case/auctionUseCase';
import AuctionRepository from '../infrastructure/repositories/AuctionRepository';
import UserRepository from '../infrastructure/repositories/UserRepositories';
import NodeMailer from '../providers/nodeMailer';
import AdminRepository from '../infrastructure/repositories/AdminRepository';

const auctionRepository = new AuctionRepository();
const userRepository = new UserRepository();
const adminRepository = new AdminRepository()
const mailer = new NodeMailer()
const auctionUseCase = new AuctionUseCase(auctionRepository, userRepository,mailer,adminRepository);
export const initAuctionCronJob = () => {
  cron.schedule('* * * * *', async () => {  
    console.log('Checking for ended auctions...');
    try {
      const auctions = await auctionUseCase.getAllActiveAuctions(); 
      console.log(auctions, 'Active Auctions fetched');
      
      for (const auction of auctions) {
        await auctionUseCase.endAuctionAndNotifyWinner(auction._id.toString());
      }

      console.log('Auction check completed.');
    } catch (error) {
      console.error('Error during auction check:', error);
    }
  });
};