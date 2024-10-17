import AddressModal from "../../entities_models/addressModal";
import { UserModel } from "../../entities_models/userModel";
import { IUserRepository } from "../../interfaces/iRepositories/iUserRepository";
import { AddressData } from "../../interfaces/model/address";
import { User } from "../../interfaces/model/user";
import admin from "../../infrastructure/config/fireBaseConfig";
import NotificationSubscriptionModel from "../../entities_models/Notification";

class UserRepository implements IUserRepository {
  async insertOne(user: User): Promise<User> {
    try {
      console.log("Incoming user data:", user);

      const newUser = new UserModel({
        ...user
      });
      await newUser.save();
      console.log("User saved successfully:", newUser);
      return newUser;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true
      }).exec();
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.error("User not found with email:", email);
        return null;
      }
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).exec();
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async updateRole(userId: string, role: "user" | "seller") {
    try {
      const user = await UserModel.findById(userId).exec();
      console.log("Output:this is the seller changing area ", user);

      if (user) {
        user.role = role;
        if (role === "seller") {
          user.isSeller = true;
        }
        await user.save();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  }
  async updatePassword(email: string, password: string): Promise<User | null> {
    try {
      const result = await UserModel.findOneAndUpdate(
        { email },
        { $set: { password } },
        { new: true }
      );
      console.log(result, "userUpdateResult");
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Error updating user");
    }
  }

  async saveAddress(addressData: AddressData): Promise<boolean> {
    try {
      console.log(
        addressData,
        "this is the address usecase area i placed this "
      );
      const {
        fullName,
        phoneNumber,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        userId
      } = addressData;

      const newAddress = new AddressModal({
        fullName,
        phoneNumber,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        userId
      });

      const result = await newAddress.save();

      return result ? true : false;
    } catch (error) {
      console.error("Unknown error occurred", error);
      throw new Error("Unknown error occurred");
    }
  }

  async updateAddress(
    addressId: string,
    addressData: Partial<AddressData>
  ): Promise<AddressData | null> {
    try {
      const updatedAddress = await AddressModal.findByIdAndUpdate(
        addressId,
        addressData,
        { new: true, runValidators: true }
      ).exec();
      if (!updatedAddress) {
        throw new Error("Address not found");
      }
      return updatedAddress;
    } catch (error) {
      console.error("Error in updateAddress:", error);
      throw error;
    }
  }

  async getAllAddress(): Promise<AddressData[]> {
    try {
      const addresses = await AddressModal.find();
      return addresses;
    } catch (error) {
      console.error("Error in getAllAddress:", error);
      return [];
    }
  }

  async getAddress(userId: string): Promise<AddressData[]> {
    try {
      const addresses = await AddressModal.find({ userId: userId });
      console.log(addresses, "addresses");
      return addresses;
    } catch (error) {
      console.error("Error in getAddressesByUserId:", error);
      return [];
    }
  }

  async getAddressById(addressId: string): Promise<AddressData | null> {
    try {
      const address = await AddressModal.findById(addressId);
      return address ? address.toObject() : null;
    } catch (error) {
      console.error("Error in getAddressById:", error);
      return null;
    }
  }

  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      console.log(addressId, "addressId");
      const result = await AddressModal.findByIdAndDelete({ _id: addressId });
      console.log(result, "result");
      return result ? true : false;
    } catch (error) {
      console.error("Error in deleteAddress:", error);
      return false;
    }
  }

  async saveFCMToken(
    userId: string,
    auctionId: string,
    fcmToken: string,
    auctionStartTime: string
  ): Promise<void> {
    const subscription = new NotificationSubscriptionModel({
      userId,
      auctionId,
      fcmToken,
      auctionStartTime
    });

    await subscription.save();
  }

  async getFCMTokensByAuction(auctionId: string): Promise<string[]> {
    const subscriptions = await NotificationSubscriptionModel.find({
      auctionId
    });
    return subscriptions.map((sub) => sub.fcmToken);
  }
}

export default UserRepository;
