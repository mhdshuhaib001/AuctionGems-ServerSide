import { User, Login } from "../model/user";
import UserOutPut from "../model/userOutPut";

interface IUserUseCase {
    sendOTP(email: string): Promise<{ status: number; message: string }>;
    signUp(userData: User): Promise<UserOutPut>;
    login(userData: Login, password: any): Promise<UserOutPut>;
}

export default IUserUseCase;
