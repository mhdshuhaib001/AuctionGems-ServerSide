import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { Login as AdminLogin } from "../interfaces/model/admin";
import AdminOutPut from "../interfaces/model/adminOutput";
import JWT from "../providers/jwt";
import AdminRepository from "../infrastructure/repositories/AdminRepository";

class AdminUseCase implements IAdminUseCase {
    private readonly adminEmail: string = process.env.ADMIN_EMAIL!;
    private readonly adminPassword: string = process.env.ADMIN_PASSWORD!;

    constructor(
        private readonly _jwt: JWT,
        private readonly _adminRepository: AdminRepository
    ) {}

    async adminLogin(loginData: AdminLogin): Promise<AdminOutPut> {
        const { email, password } = loginData;
        if (email === this.adminEmail && password === this.adminPassword) {
            const token = this._jwt.createAccessToken('adminId', 'admin'); 
            return {
                status: 200,
                message: 'Login successful',
                adminToken: token,
                _id: 'adminId'
            };
        } else {
            return {
                status: 401,
                message: 'Invalid email or password'
            };
        }
    }
     async fetchAllUsers(): Promise<any> {
        try {
            const userDatas =  await this._adminRepository.getAllUsers();
            console.log(userDatas,'fetchAllUsers')
            return userDatas
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        }
    }
    async updateUserActiveStatus(userId: string): Promise<any> {
        try {

            const result = await this._adminRepository.updateUserStatus(userId)
            console.log(result,'updated')
            return result

        } catch (error) {
            console.error(`Error updating user status to ${status}:`, error);
            throw new Error(`Error updating user status to ${status}`);
        }
    }
}

export default AdminUseCase;
