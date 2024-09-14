import { Seller } from "../model/seller";

export interface ISellerRepository{
    insertOne(seller:Seller): Promise<Seller>
    findById(email:string):Promise<Seller|null>
}