// In userOutPut.ts
import { User } from "./user";

interface UserOutPut {
  sellerId?: string
  sellerToken?:string;
  status: number;
  message?: string;
  accessToken?: string;
  userData?: User | null;
  refreshToken?: string;
}

export default UserOutPut;
