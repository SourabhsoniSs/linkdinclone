import uploadOnCloudinary from "../config/cloudinary.js"
import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        
        // Double check: Is it req.userId or req.user._id in your middleware?
        const authorId = req.userId; 

        if (!authorId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let imageUrl = "";

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            // Fix: Extract the secure_url from the returned object
            imageUrl = cloudinaryResponse?.secure_url || ""; 
        }

        const newPost = await Post.create({
            author: authorId,
            description: description || "",
            image: imageUrl // Now saving the string URL
        });

        // Optional: Populate author to send back to frontend immediately
        const populatedPost = await Post.findById(newPost._id).populate("author", "firstName lastName profileImage headline");

        return res.status(201).json(populatedPost);

    } catch (error) {
        console.error("DETAILED ERROR:", error); // This helps you see the REAL error in terminal
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


export const getPost = async (req,res)=>{
    try {
        const post=await Post.find().populate("author","firstName lastName profileImage headline")
         return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({message:"getPost error"});
    }
}