import { User } from "../model/user";
import UserOutPut from "../model/userOutPut";

export interface IUserRepository {
    insertOne(user:User):Promise<User>,
    findByEmail(email:string): Promise<User | null>,
    findById(id:string): Promise<User | null>
    updatePassword(email:string, password:string): Promise<User | null>

}