import { User } from "../model/user";

interface IAdminRepository {
    getAllUsers(): Promise<any>;
}

export default IAdminRepository;
