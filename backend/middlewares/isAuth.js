import jwt from 'jsonwebtoken'


const isAuth = async (req, res, next) => {
    // console.log("--- Auth Debug Start ---");
    // console.log("1. All Headers:", req.headers); // See if 'cookie' is even in the list
    // console.log("2. Raw Cookie Header:", req.headers.cookie); 
    // console.log("3. Parsed Cookies Object:", req.cookies); 
    
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            console.log("Result: No token found in req.cookies");
            return res.status(401).json({ message: "user does not have token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        // console.log("Result: Success! User ID:", req.userId);
        next();
    } catch (error) {
        console.log("Result: JWT Error -", error.message);
        return res.status(500).json({ message: "is auth error" });
    }
};

export default isAuth