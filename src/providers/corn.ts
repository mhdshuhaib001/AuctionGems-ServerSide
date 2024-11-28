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

function getCurrentIndianTime() {
  const now = new Date();
  const istOffset = 5.5 * 60; 
  const localOffset = now.getTimezoneOffset();
  const istTime = new Date(now.getTime() + (istOffset + localOffset) * 60000);
  return istTime;
}



export const initAuctionCronJob = () => {
  cron.schedule('* * * * *', async () => {  
    console.log('Checking for ended auctions...');  
    try {
      const auctions = await auctionUseCase.getAllActiveAuctions(); 
      
      for (const auction of auctions) {
        await auctionUseCase.endAuctionAndNotifyWinner(auction._id.toString());
      }

      console.log('Auction check completed.🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟');
    } catch (error) {
      console.error('Error during auction check:', error);
    }
  });
};




export const initRelistAuctionCronJob = () => {
  cron.schedule('0 0 * * *', async () => { 
    console.log('Checking for auctions to relist...❤️❤️');
    try {
      const auctionsToRelist = await auctionRepository.getAuctionsAwaitingPayment();
    
      
      for (const auction of auctionsToRelist) {
        await auctionUseCase.relistAuction(auction._id.toString());
      }

      console.log('Auction relisting check completed.');
    } catch (error) {
      console.error('Error during auction relisting check:', error);
    }
  });
};
