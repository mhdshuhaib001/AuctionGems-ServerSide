import { Login } from "../model/admin";
import AdminOutPut from "../model/adminOutput";

interface IAdminUseCase{
    adminLogin(userData: Login, password: any): Promise<AdminOutPut>;
    

}

export default IAdminUseCase