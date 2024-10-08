import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import { User } from "../../interfaces/model/user";
import { Category,Pagination } from "../../interfaces/model/admin";
import { UserModel } from "../../entities_models/userModel";
import CategoryModel from "../../entities_models/categoryModel";

class AdminRepository implements IAdminRepository {
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find().exec();
      return users;
    } catch (error) {
      throw new Error("Error fetching users");
    }
  }

  async updateUserStatus(userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId).exec();

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      user.isActive = !user.isActive;

      const result = await user.save();

      return result;
    } catch (error) {
      throw new Error(`Error updating user status with ID ${userId}: ${error}`);
    }
  }

  async addCategory(categoryData: Category): Promise<boolean> {
    try {
      const Category = new CategoryModel(categoryData);
      await Category.save();
      return true;
    } catch (error) {
      throw new Error(`Error adding new category: ${error}`);
    }
  }
  async getAllCategory(pagination: Pagination): Promise<{ categories: Category[]; totalCategories: number }> {
    try {

      const {page,limit} = pagination
      const categories = await CategoryModel.find().skip((page-1)*limit).limit(limit)
      const totalCategories = await CategoryModel.countDocuments();
      return {
        categories,
        totalCategories
      }
    } catch (error) {
      throw new Error("Error fetching categories")
    }
  }

  async updateCategory(_id:string,updatedData:any):Promise<boolean>{
    try {
      console.log(updatedData,'repositories')
      const updatedCategory = await CategoryModel.findByIdAndUpdate(_id, updatedData, {
        new: true, 
      });
      return updatedCategory
    } catch (error) {
      throw new Error("Error updateing categories")

    }
  }
async getAllCategorys():Promise<Category[]>{
  try {
    const categories = await CategoryModel.find();
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}


async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const result = await CategoryModel.findByIdAndDelete(categoryId);
      return result;
    } catch (error) {
      throw new Error("Error deleting category");
    }
  }
}

export default AdminRepository;
