export interface Login {
  email: string;
  password: string;
}
export interface Category {
  name: string;
  icon: string;
  image: string;
}


export interface Pagination{
  page:number ;
  limit: number
}