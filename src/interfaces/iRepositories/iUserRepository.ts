import { User } from "../model/user";

export interface IUserRepository {
    insertOne(user:User):Promise<User>,
    findByEmail(email:string): Promise<User | null>,
    findById(id:string): Promise<User | null>
}