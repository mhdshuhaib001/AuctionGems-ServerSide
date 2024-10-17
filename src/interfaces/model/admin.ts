export interface Login {
  email: string;
  password: string;
}
export interface Category {
  _id?: string;
  name: string;
  iconUrl: string;
  imageUrl: string;
}


export interface Pagination{
  page:number ;
  limit: number
}