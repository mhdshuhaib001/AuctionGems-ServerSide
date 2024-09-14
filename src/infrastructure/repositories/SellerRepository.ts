import SellerModel from "../../entities_models/sellerModel";
import { ISellerRepository } from "../../interfaces/iRepositories/iSellerRepository";
import { Seller } from "../../interfaces/model/seller";

class SellerRepository implements ISellerRepository {
    async insertOne(sellerData: Omit<Seller, "_id">): Promise<Seller> {
        try {
            const newSeller = new SellerModel(sellerData);
            
            await newSeller.save();
            return newSeller;
        } catch (error) {
            console.error("Error inserting seller:", error);
            throw new Error("Failed to insert seller.");
        }
    }

    async findById(id: string): Promise<Seller | null> {
        try {
            const seller = await SellerModel.findById(id).exec(); 
            return seller;
        } catch (error) {
            console.error("Error finding seller by ID:", error);
            throw new Error("Failed to find seller.");
        }
    }
    
}

export default SellerRepository;
