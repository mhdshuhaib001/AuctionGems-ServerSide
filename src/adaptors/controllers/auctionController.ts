import { Request, Response } from "express";
import AuctionUseCase from "../../use-case/auctionUseCase";

class AuctionController {
  constructor(private readonly _auctionUseCase: AuctionUseCase) {}

  async placeBid(req: Request, res: Response) {
    try {
      const { auctionId, bidderId, currentBid, bidAmount, time, sellerId } =
        req.body;

      const bid = {
        auctionId,
        bidderId,
        bidAmount,
        currentBid,
        time,
        sellerId
      };
      const result = await this._auctionUseCase.placeBid(bid);
    } catch (error) {
      console.error("Error auction placeBid session:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error"
      });
    }
  }

  async getBids(req: Request, res: Response) {
    try {
      const auctionId = req.params.id;

      const result = await this._auctionUseCase.fetchBidders(auctionId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error auction placeBid session:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error"
      });
    }
  }

  async auctionWinnerCheck(req: Request, res: Response) {
    try {
      const auctionId = req.params.auctionId;
      const winner = this._auctionUseCase.endAuctionAndNotifyWinner(auctionId);
      res.status(200).json(winner);
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Internal server error"
      });
    }
  }
}

export default AuctionController;
