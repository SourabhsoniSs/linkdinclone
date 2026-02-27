import User from '../models/user.mode.js'
import uploadOnCloudinary from '../config/cloudinary.js';


export const getCurrentUser=async (req,res)=>{
    try {
        const user=await User.findById(req.userId).select("-password");
        if(!user)
            return res.status(400).json({message:"user does not found"})

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);

        return res.status(500).json({message:"get current user error"})
        
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        // FIX: Change 'headLine' to 'headline' to match frontend append("headline", ...)
        let { firstName, userName, lastName, headline, location, gender, skills, education, experience } = req.body;

        const updateFields = {
            firstName,
            userName,
            lastName,
            headline, // Use the corrected name here
            location,
            gender
        };

        // Debugging: This will tell you if Multer is actually receiving the files
        console.log("Received Files:", req.files);

        if (skills) updateFields.skills = JSON.parse(skills);
        if (education) updateFields.education = JSON.parse(education);
        if (experience) updateFields.experience = JSON.parse(experience);

        if (req.files) {
            // Check Profile Image
            if (req.files.profileImage && req.files.profileImage[0]) {
                const result = await uploadOnCloudinary(req.files.profileImage[0].path);
                if (result) updateFields.profileImage = result.secure_url || result.url;
            }

            // Check Cover Image
            if (req.files.coverImage && req.files.coverImage[0]) {
                const result = await uploadOnCloudinary(req.files.coverImage[0].path);
                if (result) updateFields.coverImage = result.secure_url || result.url;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: "Update profile error", error: error.message });
    }
};