import { Category, Login } from "../model/admin";
import AdminOutPut from "../model/adminOutput";

interface IAdminUseCase {
  adminLogin(loginData: Login): Promise<AdminOutPut>;
  fetchAllUsers(): Promise<any>;
  updateUserActiveStatus(userId: string): Promise<any>;
  addCategory(
      categoryData: Category,
      imageFile: Express.Multer.File | null,
      iconFile: Express.Multer.File | null   
  ): Promise<boolean>;
}

export default IAdminUseCase;
