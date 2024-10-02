import { Readable } from "stream";
import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { Login as AdminLogin, Category } from "../interfaces/model/admin";
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
      console.log(userDatas, "fetchAllUsers");
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

      // Helper function for uploading files
      const uploadFile = async (
        file: Express.Multer.File | null
      ): Promise<string | null> => {
        if (!file) {
          console.warn("No file provided for upload.");
          return null;
        }

        return new Promise((resolve, reject) => {
          // Createing a readable stream from the file buffer
          const stream = new Readable();
          stream.push(file.buffer);
          stream.push(null);

          //  upload_stream method
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: categoryFolder,
              resource_type: "auto"
            },
            (error, result) => {
              if (error) {
                return reject(
                  new Error(
                    "File upload failed: " + (error.message || "unknown error")
                  )
                );
              }
              resolve(result?.secure_url || null);
            }
          );

          stream.pipe(uploadStream).on("error", (uploadError) => {
            reject(new Error("Stream piping failed: " + uploadError.message));
          });
        });
      };

      categoryData.image = (await uploadFile(imageFile)) || "";
      categoryData.icon = (await uploadFile(iconFile)) || "";

      const category = await this._adminRepository.addCategory(categoryData);

      return true;
    } catch (error) {
      console.error(
        `Error adding category Usecase: ${error instanceof Error ? error.message : error}`
      );
      return false;
    }
  }

  async getAllCategory(): Promise<any> {
    try {
      const fetchedCategory = await this._adminRepository.getAllCategory();
      return fetchedCategory;
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

          const imageFile = files.image;
          console.log(imageFile,'image file ')
          const imageUrl = await this._cloudinaryHelper.uploadSingleFile(
            imageFile,
            "category"
          );
          console.log(imageUrl,'imageweeeeeeeeeeeeeeee')
          updateData.image = imageUrl || "";
        }
        if (files.icon) {
          const iconFile = files.icon;
  
          const iconUrl = await this._cloudinaryHelper.uploadSingleFile(iconFile, 'category');
          console.log(iconUrl,'imageweeeeeeeeeeeeeeee')

          updateData.icon = iconUrl || ""; 
        }
      }

      console.log(updateData,'update update Category')

      const result = await this._adminRepository.updateCategory(
        categoryId,
        updateData
      );
      console.log(result,'suiiiiiiii')
      return result;
    } catch (error) {
      console.error(
        `Error update category Usecase: ${error instanceof Error}`
      );
      return false;
    }
  }
}

export default AdminUseCase;
