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
const bidModel_1 = __importDefault(require("../../entities_models/bidModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const productModal_1 = __importDefault(require("../../entities_models/productModal"));
const orderModel_1 = __importDefault(require("../../entities_models/orderModel"));
const auctionHistory_1 = require("../../entities_models/auctionHistory");
class AuctionRepository {
    placeBid(bidderId, auctionId, sellerId, currentBid, bidAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBid = new bidModel_1.default({
                    auctionId,
                    buyerID: bidderId,
                    sellerID: sellerId,
                    currentBid: currentBid,
                    bidStatus: "Active"
                });
                const savedBid = yield newBid.save();
                return savedBid;
            }
            catch (error) {
                console.error("Error placing bid:", error);
                return null;
            }
        });
    }
    updateAuctionBid(auctionId, newBid) {
        return __awaiter(this, void 0, void 0, function* () {
            const auction = yield productModal_1.default.findById(auctionId);
            if (!auction) {
                throw new Error("Auction not found");
            }
            auction.currentBid = newBid;
            yield auction.save();
        });
    }
    updateAuctionStatus(auctionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const auction = yield productModal_1.default.findById(auctionId);
            if (!auction) {
                throw new Error("Auction not found");
            }
            if (status !== "sold" &&
                status !== "live" &&
                status !== "upcoming" &&
                status !== "relisted" &&
                status !== "end" &&
                status !== "unsold") {
                throw new Error("Invalid auction status");
            }
            auction.auctionStatus = status;
            yield auction.save();
        });
    }
    getBiddings(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(auctionId);
                const bidders = yield bidModel_1.default.find({ auctionId: objectId }).exec();
                return bidders;
            }
            catch (error) {
                console.error("Error placing fetching bids:", error);
                return [];
            }
        });
    }
    getAuctionItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auctionItem = yield productModal_1.default.findOne({ _id: id });
                if (!auctionItem) {
                    throw new Error("Auction item not found");
                }
                return auctionItem;
            }
            catch (error) {
                console.error("Error finding auction item:", error);
                throw error;
            }
        });
    }
    getActiveAuctions(currentTimeInIST) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(currentTimeInIST, "halooooooo this is the main thing");
                const activeAuctions = yield productModal_1.default.find({
                    auctionStatus: { $ne: "sold" },
                    auctionFormat: { $ne: "buy-it-now" },
                    auctionEndDateTime: { $lte: currentTimeInIST }
                });
                return activeAuctions;
            }
            catch (error) {
                console.error("Error fetching active auctions:", error);
                throw error;
            }
        });
    }
    getAuctionAwaitPayment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield orderModel_1.default.find({
                    status: "sold",
                    paymentStatus: "pending",
                    paymentDueDate: { $lt: new Date() }
                });
            }
            catch (error) {
                console.error("Error fetching await auctionPaymen:", error);
                throw error;
            }
        });
    }
    findById(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield orderModel_1.default.findOne({ productId: auctionId });
            }
            catch (error) {
                console.error("Error fetching await findById:", error);
                throw error;
            }
        });
    }
    resetAuctionBids(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auction = yield productModal_1.default.findById(auctionId);
                if (!auction) {
                    throw new Error("Auction not found");
                }
                auction.currentBid = 0;
                auction.auctionStatus = "upcoming";
                yield auction.save();
                yield bidModel_1.default.deleteMany({ auctionId: auction._id });
            }
            catch (error) {
                console.error("Error resetting auction bids:", error);
                throw error;
            }
        });
    }
    getAuctionItems(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auctionItems = yield productModal_1.default.findById(id).exec();
                if (!auctionItems) {
                    console.error("Auction item not found");
                    return null;
                }
                const auctionItem = yield orderModel_1.default.findOne({
                    productId: auctionItems._id
                }).exec();
                return auctionItem;
            }
            catch (error) {
                console.error("Error finding auction item:", error);
                throw new Error("Error fetching auction item");
            }
        });
    }
    getAuctionsAwaitingPayment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                const orders = yield orderModel_1.default.find({
                    paymentStatus: "pending",
                    paymentDueDate: { $lt: twoDaysAgo },
                    orderStatus: { $ne: "completed" }
                }).populate("productId");
                const auctions = orders.map((order) => order.productId);
                return auctions;
            }
            catch (error) {
                console.error("Error fetching auctions awaiting payment:", error);
                throw error;
            }
        });
    }
    createAuctionHistory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = new auctionHistory_1.UserAuctionHistory(data);
                return yield history.save();
            }
            catch (error) {
                console.error("Error adding auction history:", error);
                throw error;
            }
        });
    }
    findByUserIdHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield auctionHistory_1.UserAuctionHistory.find({ userId }).exec();
            }
            catch (error) {
                console.error("Error get auction history:", error);
                throw error;
            }
        });
    }
}
exports.default = AuctionRepository;
