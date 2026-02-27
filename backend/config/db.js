import mongoose from "mongoose";

const  connectDB = async() =>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected");
        
    } catch (error) {
        console.log("connection error");
        
    }
}

export default connectDB