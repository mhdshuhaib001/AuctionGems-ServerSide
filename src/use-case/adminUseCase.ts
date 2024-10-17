import { Readable } from "stream";
import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { Login as AdminLogin, Category, Pagination } from "../interfaces/model/admin";
import AdminOutPut from "../interfaces/model/adminOutput";
import JWT from "../providers/jwt";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import cloudinary from "../infrastructure/config/cloudinary";
import CloudinaryHelper from "../providers/cloudinaryHelper";
class AdminUseCase implements IAdminUseCase {
  private readonly adminEmail: string = process.env.ADMIN_EMAIL!;
  private readonly adminPassword: string = process.env.ADMIN_PASSWORD!;

  constructor(
    private readonly _jwt: JWT,
    private readonly _adminRepository: AdminRepository,
    private readonly _cloudinaryHelper: CloudinaryHelper
  ) {}

  async adminLogin(loginData: AdminLogin): Promise<AdminOutPut> {
    const { email, password } = loginData;
    if (email === this.adminEmail && password === this.adminPassword) {
      const token = this._jwt.createAccessToken("adminId", "admin");
      return {
        status: 200,
        message: "Login successful",
        adminToken: token,
        _id: "adminId"
      };
    } else {
      return {
        status: 401,
        message: "Invalid email or password"
      };
    }
  }
  async fetchAllUsers(): Promise<any> {
    try {
      const userDatas = await this._adminRepository.getAllUsers();
      return userDatas;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Error fetching users");
    }
  }
  async updateUserActiveStatus(userId: string): Promise<any> {
    try {
      const result = await this._adminRepository.updateUserStatus(userId);
      console.log(result, "updated");
      return result;
    } catch (error) {
      console.error(`Error updating user status to ${status}:`, error);
      throw new Error(`Error updating user status to ${status}`);
    }
  }

  async addCategory(
    categoryData: Category,
    imageFile: Express.Multer.File | null,
    iconFile: Express.Multer.File | null
  ): Promise<boolean> {
    try {
      const categoryFolder = `category/${categoryData.name}`;
  
      const imageUrl = imageFile?.buffer
        ? await this._cloudinaryHelper.uploadBuffer(imageFile.buffer, categoryFolder)
        : "";
      const iconUrl = iconFile?.buffer
        ? await this._cloudinaryHelper.uploadBuffer(iconFile.buffer, categoryFolder)
        : "";
      categoryData.imageUrl = imageUrl;
      categoryData.iconUrl = iconUrl || "";
  
      const category = await this._adminRepository.addCategory(categoryData);
  
      return true;
    } catch (error) {
      console.error(`Error adding category Usecase: ${error instanceof Error ? error.message : error}`);
      return false;
    }
  }

  async getAllCategory(pagination:Pagination): Promise<any> {
    try {
      const {page,limit} = pagination
      const {categories,totalCategories} = await this._adminRepository.getAllCategory({page,limit});
      const totalPages = Math.ceil(totalCategories/limit)
      return {
        categories,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error(
        `Error fetching allcategory Usecase: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  async updateCategory(
    categoryId: string,
    bodyData: any,
    files: any
  ): Promise<boolean> {
    try {
      const updateData = { ...bodyData };
      if (files) {
        if (files.image) {
          const imageFile = files.image[0];
          const imageUrl = await this._cloudinaryHelper.uploadBuffer(
            imageFile.buffer,
            "category"
          );

          console.log(imageUrl,'image url chek on here ')
          updateData.imageUrl = imageUrl || "";
        }

        if (files.icon) {
          const iconFile = files.icon;

          const iconUrl = await this._cloudinaryHelper.uploadSingleFile(
            iconFile,
            "category"
          );

          updateData.iconUrl = iconUrl || "";
        }
      }


      const result = await this._adminRepository.updateCategory(
        categoryId,
        updateData
      );
      return result;
    } catch (error) {
      console.error(`Error update category Usecase: ${error instanceof Error}`);
      return false;
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const result = await this._adminRepository.deleteCategory(categoryId);
      return result;
    } catch (error) {
      console.error(`Error deleting category Usecase: ${error instanceof Error}`);
      return false;
    }
  }
}

export default AdminUseCase;
