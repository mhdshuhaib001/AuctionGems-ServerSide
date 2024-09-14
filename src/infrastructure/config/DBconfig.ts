import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
export const DBconfig = async()=>{
    try{
       const DB_URL = process.env.DATABASE_URL as string;
       
         await mongoose.connect(DB_URL)
         .then(()=> console.log("📊 Database connected successfully!"))
         .catch(() => console.log('DB Connection failed try again'))
    } catch(error){
        console.error(error)
    }
}