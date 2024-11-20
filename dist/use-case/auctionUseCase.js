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
const socket_io_1 = require("../infrastructure/config/services/socket-io");
const productModal_1 = __importDefault(require("../entities_models/productModal"));
require("dotenv").config();
class AuctionUseCase {
    constructor(_auctionRepository, _userRepository, _mailer, _adminRepository) {
        this._auctionRepository = _auctionRepository;
        this._userRepository = _userRepository;
        this._mailer = _mailer;
        this._adminRepository = _adminRepository;
    }
    placeBid(bid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auctionId, bidderId, currentBid, bidAmount, sellerId, time } = bid;
                console.log(bid);
                const auction = yield this._auctionRepository.getAuctionItem(auctionId);
                if (!auction) {
                    throw new Error("Auction not found");
                }
                console.log(bidAmount, auction.currentBid, "befor check the bid amount ");
                if (bidAmount <= auction.currentBid) {
                    throw new Error("Bid amount must be higher than the current bid");
                }
                const result = yield this._auctionRepository.placeBid(bidderId, auctionId, sellerId || "", bidAmount, currentBid);
                if (!result) {
                    throw new Error("Failed to place bid in the database");
                }
                yield this._auctionRepository.updateAuctionBid(auctionId, bidAmount);
            }
            catch (error) {
                console.error("Error placing bid:", error);
                throw error;
            }
        });
    }
    // fetch alll the bids
    fetchBidders(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bids = yield this._auctionRepository.getBiddings(auctionId);
                const sortedBids = bids.sort((a, b) => b.currentBid - a.currentBid);
                const topBids = sortedBids.slice(0, 5);
                const biddersData = yield Promise.all(topBids.map((bid) => __awaiter(this, void 0, void 0, function* () {
                    const userData = yield this._userRepository.findById(bid.buyerID.toString());
                    if (!userData) {
                        return null;
                    }
                    return {
                        id: bid._id,
                        bidder: userData.name,
                        amount: bid.currentBid,
                        time: bid.time,
                        avatar: userData.profileImage
                    };
                })));
                const filteredBiddersData = biddersData.filter((bid) => bid !== null);
                return filteredBiddersData;
            }
            catch (error) {
                console.error("Error fetching bidders:", error);
                throw error;
            }
        });
    }
    // to check the winner on aftr the auction end
    endAuctionAndNotifyWinner(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Ending auction for auctionId: ${auctionId}`);
                const auctionItem = yield this._auctionRepository.getAuctionItem(auctionId);
                if (!auctionItem) {
                    console.error("Auction not found");
                    throw new Error("Auction not found");
                }
                const currentTime = new Date();
                const endTime = new Date(auctionItem.auctionEndDateTime);
                console.log(`Current time: ${currentTime}, End time: ${endTime}`);
                if (currentTime < endTime) {
                    console.log(`Auction ${auctionId} hasn't ended yet. Current: ${currentTime}, End: ${endTime}`);
                    throw new Error("auction is not ended");
                }
                const bids = yield this._auctionRepository.getBiddings(auctionId);
                if (!bids || bids.length === 0) {
                    yield productModal_1.default.findByIdAndUpdate(auctionId, {
                        sold: false,
                        auctionStatus: "unsold"
                    });
                    console.log(`No bids found for auction ${auctionId}. Marked as unsold.`);
                    return {
                        winnerId: "",
                        paymentLink: "",
                        productName: "",
                        image: "",
                        currentBid: 0
                    };
                }
                const sortedBids = bids.sort((a, b) => b.currentBid - a.currentBid ||
                    new Date(b.time).getTime() - new Date(a.time).getTime());
                const highestBid = sortedBids[0];
                console.log(`Highest bid: ${JSON.stringify(highestBid)}`);
                const winner = yield this._userRepository.findById(highestBid.buyerID.toString());
                if (!winner || !winner._id) {
                    throw new Error("Winner not found or missing ID");
                }
                const productName = auctionItem.itemTitle;
                const paymentLink = `${process.env.FRONTEND_URL}/checkout/${auctionId}`;
                const emailSent = yield this._mailer.sendWinnerMail(winner.email, productName, highestBid.currentBid, paymentLink, auctionItem.images[0]);
                if (emailSent) {
                    console.log("Winner email sent successfully.");
                }
                yield productModal_1.default.findByIdAndUpdate(auctionId, {
                    sold: true,
                    finalBidAmount: highestBid.currentBid,
                    auctionStatus: "sold"
                });
                yield this._auctionRepository.updateAuctionStatus(auctionId, "sold");
                const io = (0, socket_io_1.getSocketInstance)();
                io.to(auctionId).emit("auction_winner", {
                    auctionId,
                    winnerId: winner._id.toString(),
                    winningBid: highestBid.currentBid,
                    productTitle: auctionItem.itemTitle,
                    productImage: auctionItem.images[0],
                    checkoutLink: paymentLink
                });
                io.emit("new_order_notification", {
                    id: Date.now().toString(),
                    sellerId: auctionItem.sellerId,
                    orderId: auctionItem._id,
                    productName: auctionItem.itemTitle,
                    buyerId: auctionItem.sellerId,
                    price: auctionItem.currentBid,
                    timestamp: new Date().toISOString(),
                    isRead: false
                });
                console.log(`Auction ${auctionId} ended. Winner ID: ${winner._id.toString()}`);
                return {
                    winnerId: winner._id.toString(),
                    paymentLink,
                    productName,
                    image: auctionItem.images[0],
                    currentBid: highestBid.currentBid
                };
            }
            catch (error) {
                console.error("Error ending auction or notifying winner:", error);
                throw error;
            }
        });
    }
    relistAuction(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auction = yield this._auctionRepository.getAuctionItems(auctionId);
                if (!auction) {
                    throw new Error("Auction not found");
                }
                if (auction.auctionStatus === "sold" &&
                    auction.paymentStatus === "pending") {
                    yield this._auctionRepository.updateAuctionStatus(auctionId, "relisted");
                    yield this._auctionRepository.resetAuctionBids(auctionId);
                    console.log(`Auction ${auctionId} has been relisted.`);
                }
                else {
                    console.log(`Auction ${auctionId} cannot be relisted because payment was not pending.`);
                }
            }
            catch (error) {
                console.error("Error relisting auction:", error);
                throw error;
            }
        });
    }
    getAllActiveAuctions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentTimeInIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString();
                const customTimeInIST = "2024-11-18T20:32:00";
                console.log(currentTimeInIST, "========", currentTimeInIST);
                const activeAuctions = yield this._auctionRepository.getActiveAuctions(currentTimeInIST);
                console.log(activeAuctions, "this is the active auctions ");
                return activeAuctions;
            }
            catch (error) {
                console.error("Error fetching active auctions:", error);
                throw error;
            }
        });
    }
    getAwaitPayment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) { }
        });
    }
    createAuctionHistory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.userId ||
                !data.auctionId ||
                !data.productName ||
                !data.amount ||
                !data.status ||
                !data.actionDate) {
                throw new Error("All required fields must be provided.");
            }
            return yield this._auctionRepository.createAuctionHistory(data);
        });
    }
}
exports.default = AuctionUseCase;
