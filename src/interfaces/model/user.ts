export interface User {
    _id: string;
     name: string;
    email: string;
    password: string;
    phoneNo?: number;
    otp?: number;
    isActive: boolean;
    isSeller: boolean;
    role?: 'user' | 'seller';
    accessToken?:string
}


export interface Login {
    email: string,
    password: string
}


export interface UserResponseData {
    _id: string;
    name: string;
    email: string;
    role?: 'user' | 'seller';
}