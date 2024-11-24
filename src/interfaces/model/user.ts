
export interface User {
    _id?:string
    name: string;
    profileImage?:string;
    email: string;
    password: string;
    otp?: number;
    isActive?: boolean;
    isSeller?: boolean;
    role?: 'user' | 'seller'| 'admin';
    accessToken?:string
    wallet?:any
}


export interface Login {
    email: string,
    password: string
}


export interface UserResponseData {
    _id?: string
    name: string;
    email: string;
    role?: 'user' | 'seller'|'admin';
}


  