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
Object.defineProperty(exports, "__esModule", { value: true });
class AuctionController {
    constructor(_auctionUseCase) {
        this._auctionUseCase = _auctionUseCase;
    }
    placeBid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auctionId, bidderId, currentBid, bidAmount, time, sellerId } = req.body;
                const bid = {
                    auctionId,
                    bidderId,
                    bidAmount,
                    currentBid,
                    time,
                    sellerId
                };
                const result = yield this._auctionUseCase.placeBid(bid);
            }
            catch (error) {
                console.error("Error auction placeBid session:", error);
                res.status(500).json({
                    message: error instanceof Error ? error.message : "Internal server error"
                });
            }
        });
    }
    getBids(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auctionId = req.params.id;
                const result = yield this._auctionUseCase.fetchBidders(auctionId);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error("Error auction placeBid session:", error);
                res.status(500).json({
                    message: error instanceof Error ? error.message : "Internal server error"
                });
            }
        });
    }
    auctionWinnerCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auctionId = req.params.auctionId;
                const winner = this._auctionUseCase.endAuctionAndNotifyWinner(auctionId);
                res.status(200).json(winner);
            }
            catch (error) {
                res.status(500).json({
                    message: error instanceof Error ? error.message : "Internal server error"
                });
            }
        });
    }
}
exports.default = AuctionController;
