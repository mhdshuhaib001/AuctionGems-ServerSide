import { User } from "../model/user";
import { Category } from "../model/admin";
interface IAdminRepository {
    getAllUsers(): Promise<any>;
    addCategory(categoryData: Category): Promise<boolean>
}

export default IAdminRepository;
