import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import { User } from "../../interfaces/model/user";
import { UserModel } from "../../entities_models/userModel";

class AdminRepository implements IAdminRepository {
    async getAllUsers(): Promise<User[]> {
        try {
            const users = await UserModel.find().exec();
            return users;
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }

    // Method to block a user
    async blockUser(userId: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(
                userId,
                { status: 'Inactive' },
                { new: true, runValidators: true }
            ).exec();
        } catch (error) {
            throw new Error(`Error blocking user with ID ${userId}`);
        }
    }

    // Method to unblock a user
    async unblockUser(userId: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(
                userId,
                { status: 'Active' },
                { new: true, runValidators: true }
            ).exec();
        } catch (error) {
            throw new Error(`Error unblocking user with ID ${userId}`);
        }
    }
}

export default AdminRepository;
