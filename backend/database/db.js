import mongoose from 'mongoose'
import { configDotenv } from 'dotenv'
configDotenv();
const URL=process.env.DB
const  connection = async () =>{
    try{
         await mongoose.connect(URL,{});
         console.log("we rolling database connected");
    }catch(error){
        console.log(error.message);
    }
}
export default connection;