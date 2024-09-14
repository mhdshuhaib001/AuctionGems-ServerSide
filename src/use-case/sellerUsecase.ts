import cloudinary from "../infrastructure/config/cloudinary ";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import userRepository from "../infrastructure/repositories/UserRepositories";
import JWT from "../providers/jwt";
import { Seller } from "../interfaces/model/seller";

class SellerUseCase {
    constructor(
        private readonly _SellerRepository: SellerRepository, 
        private readonly _UserRepository: userRepository,
        private readonly _jwt:  JWT   
    ){}

    async createSeller(sellerData: Seller) {
        try {
            console.log(sellerData,'sellerdarta')
            const result = await this._SellerRepository.insertOne(sellerData);
            await this._UserRepository.updateRole(sellerData.UserID.toString(), 'seller');
            const sellerToken = this._jwt.createAccessToken(sellerData.UserID.toString(), 'seller');
console.log(sellerToken,'heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')

            console.log(result, 'seller data is this');
            return {
                status: 202,
                message: "Seller created successfully",
                sellerData: sellerData,
                sellerToken
            };
        } catch (error) {
            console.error("Error creating seller:", error);
            throw new Error("Failed to create seller.");
        }
    }

}

export default SellerUseCase;
