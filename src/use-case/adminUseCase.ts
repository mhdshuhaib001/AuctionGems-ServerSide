import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { Login as AdminLogin, Category } from "../interfaces/model/admin";
import AdminOutPut from "../interfaces/model/adminOutput";
import JWT from "../providers/jwt";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import cloudinary from "../infrastructure/config/cloudinary";


class AdminUseCase implements IAdminUseCase {
  private readonly adminEmail: string = process.env.ADMIN_EMAIL!;
  private readonly adminPassword: string = process.env.ADMIN_PASSWORD!;
  

  constructor(
    private readonly _jwt: JWT,
    private readonly _adminRepository: AdminRepository,
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
        console.log(imageFile,'sasmkdf',iconFile)
        const uploadFile = async  (file: Express.Multer.File | null): Promise<string | null> => {
            if (!file || !file.stream) {
                console.warn('No file or stream provided for upload.');
                return null; 
            }

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: categoryFolder },
                    (err, result) => {
                        if (err) {
                            return reject(new Error('File upload failed: ' + err.message));
                        }
                        resolve(result?.secure_url ?? null);
                    }
                );

                file.stream.pipe(uploadStream).on('error', (uploadError) => {
                    reject(new Error('Stream piping failed: ' + uploadError.message));
                });
            });
        };

        // Upload image and icon
        categoryData.image = await uploadFile(imageFile) ?? '';
        categoryData.svgIcon = await uploadFile(iconFile) ?? '';

        const category = await this._adminRepository.addCategory(categoryData);
        console.log(category, 'this is the use case category');

        return true;
    } catch (error) {
        console.error(`Error adding category Usecase: ${error instanceof Error ? error.message : error}`);
        return false; // Indicate failure
    }
}

}

export default AdminUseCase;
