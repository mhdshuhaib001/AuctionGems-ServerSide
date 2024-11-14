import { AddressData } from "../model/address";
import { User } from "../model/user";
import UserOutPut from "../model/userOutPut";

export interface IUserRepository {
    insertOne(user:User):Promise<User>,
    findByEmail(email:string): Promise<User | null>,
    findById(id:string): Promise<User | null>
    updatePassword(email:string, password:string): Promise<User | null>
    saveAddress(addressData:AddressData):Promise<boolean>
    updateUser(
        userId: string,
        userData: Partial<User>
      ): Promise<User | null> 
      updateRole(userId: string, role: "user" | "seller"):Promise<boolean>
      updatePassword(email: string, password: string): Promise<User | null>
      saveAddress(addressData: AddressData): Promise<boolean>
      updateAddress(
        addressId: string,
        addressData: Partial<AddressData>
      ): Promise<AddressData | null>
      getAllAddress(): Promise<AddressData[]>
      getAddress(userId: string): Promise<AddressData[]>
      getAddressById(addressId: string): Promise<AddressData | null> 
      deleteAddress(addressId: string): Promise<boolean>
      saveFCMToken(
        userId: string,
        auctionId: string,
        fcmToken: string,
        auctionStartTime: string
      ): Promise<void>
      getFCMTokensByAuction(auctionId: string): Promise<string[]> 
      changePassword(
        userId: string,
        hashedPassword: string
      ): Promise<boolean>
}