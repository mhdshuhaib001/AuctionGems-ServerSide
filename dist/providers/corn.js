"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRelistAuctionCronJob = exports.initAuctionCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const auctionUseCase_1 = __importDefault(require("../use-case/auctionUseCase"));
const AuctionRepository_1 = __importDefault(require("../infrastructure/repositories/AuctionRepository"));
const UserRepositories_1 = __importDefault(require("../infrastructure/repositories/UserRepositories"));
const nodeMailer_1 = __importDefault(require("../providers/nodeMailer"));
const AdminRepository_1 = __importDefault(require("../infrastructure/repositories/AdminRepository"));
const auctionRepository = new AuctionRepository_1.default();
const userRepository = new UserRepositories_1.default();
const adminRepository = new AdminRepository_1.default();
const mailer = new nodeMailer_1.default();
const auctionUseCase = new auctionUseCase_1.default(auctionRepository, userRepository, mailer, adminRepository);
function getCurrentIndianTime() {
    const now = new Date();
    const istOffset = 5.5 * 60;
    const localOffset = now.getTimezoneOffset();
    const istTime = new Date(now.getTime() + (istOffset + localOffset) * 60000);
    return istTime;
}
const initAuctionCronJob = () => {
    node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking for ended auctions...');
        try {
            const auctions = yield auctionUseCase.getAllActiveAuctions();
            for (const auction of auctions) {
                yield auctionUseCase.endAuctionAndNotifyWinner(auction._id.toString());
            }
            console.log('Auction check completed.🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟');
        }
        catch (error) {
            console.error('Error during auction check:', error);
        }
    }));
};
exports.initAuctionCronJob = initAuctionCronJob;
const initRelistAuctionCronJob = () => {
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking for auctions to relist...❤️❤️');
        try {
            const auctionsToRelist = yield auctionRepository.getAuctionsAwaitingPayment();
            for (const auction of auctionsToRelist) {
                yield auctionUseCase.relistAuction(auction._id.toString());
            }
            console.log('Auction relisting check completed.');
        }
        catch (error) {
            console.error('Error during auction relisting check:', error);
        }
    }));
};
exports.initRelistAuctionCronJob = initRelistAuctionCronJob;
