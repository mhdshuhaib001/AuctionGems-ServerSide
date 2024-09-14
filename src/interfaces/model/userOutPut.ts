// In userOutPut.ts
import { UserResponseData } from "./user";

interface UserOutPut {
  status: number;
  message: string;
  accessToken?: string;
  userData?: UserResponseData | null;
}

export default UserOutPut;
