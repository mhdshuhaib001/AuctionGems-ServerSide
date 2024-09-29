// In userOutPut.ts
import { User } from "./user";

interface UserOutPut {
  sellerToken?:string;
  status: number;
  message?: string;
  accessToken?: string;
  userData?: User | null;
}

export default UserOutPut;
